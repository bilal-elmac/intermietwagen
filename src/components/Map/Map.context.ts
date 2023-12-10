import React from 'react';

import { StationInteractionType, Station } from '../../domain/Station';
import { FilterOption } from '../../domain/Filter';

import { useReduxState, useReduxDispatch } from '../../reducers/Actions';
import { openMap } from '../../reducers/MapActions';

import { Optional } from '../../utils/TypeUtils';
import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

export interface MapContextState {
    /**
     * Map key is used to auto close the map on new searches
     */
    readonly focusedStationId: string | null;
    readonly stationsType: StationInteractionType;
    readonly isStationsListOpen: Record<StationInteractionType, boolean>;
}

const MapContextInitialState: MapContextState = {
    focusedStationId: null,
    stationsType: 'pickUp',

    isStationsListOpen: {
        pickUp: false,
        dropOff: false,
    },
};

export type FocusStationPayload = Optional<Pick<MapContextState, 'focusedStationId' | 'stationsType'>, 'stationsType'>;

type Action =
    | { type: 'FOCUS_STATION'; payload: FocusStationPayload }
    | { type: 'TOGGLE_MAP'; payload: boolean }
    | { type: 'SET_STATIONS_TYPE'; payload: MapContextState['stationsType'] }
    | { type: 'SET_STATIONS_LIST_VISIBILITY'; payload: Partial<MapContextState['isStationsListOpen']> };

type Dispatch = (action: Action) => void;
type MapProviderProps = { children: React.ReactNode };
type Padding = { unfocusBlock: number };

const UNFOCUS_BLOCK_TIMEOUT = 500;

const MapStateContext = React.createContext<MapContextState>(MapContextInitialState);
const MapDispatchContext = React.createContext<Dispatch | undefined>(undefined);
const FocusPadding = React.createContext<Padding | null>(null);

const mapStateReducer = (state: MapContextState, action: Action): MapContextState => {
    switch (action.type) {
        case 'FOCUS_STATION':
            return { ...state, ...action.payload };
        case 'SET_STATIONS_TYPE':
            return { ...state, stationsType: action.payload };
        case 'SET_STATIONS_LIST_VISIBILITY':
            return { ...state, isStationsListOpen: { ...state.isStationsListOpen, ...action.payload } };
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
};

const MapStateProvider = ({ children }: MapProviderProps): JSX.Element => {
    const [state, dispatch] = React.useReducer(mapStateReducer, MapContextInitialState);

    /**
     * This a work-around to enable the unfocus station hook to not act until a given period
     *
     * Because of how react hooks and leaflet maps were implemented, if they are called mid-re-render, they will retain the previous useless values reference
     *
     * Which means this padding can NOT be updated through a setState, as the previous one would still be in scope
     */
    const [padding] = React.useState<Padding>({ unfocusBlock: 0 });

    return (
        <MapStateContext.Provider value={state}>
            <MapDispatchContext.Provider value={dispatch}>
                <FocusPadding.Provider value={padding}>{children}</FocusPadding.Provider>
            </MapDispatchContext.Provider>
        </MapStateContext.Provider>
    );
};

const useMapState = (): MapContextState => {
    const context = React.useContext(MapStateContext);
    if (context === undefined) {
        throw new Error('useMapState must be used within a MapStateProvider');
    }
    return context;
};

const useMapDispatch = (): Dispatch => {
    const context = React.useContext(MapDispatchContext);

    if (context === undefined) {
        throw new Error('useMapDispatch must be used within a MapStateProvider');
    }

    return context;
};

const useFocusPadding = (): Padding => {
    const context = React.useContext(FocusPadding);

    if (context === null) {
        throw new Error('useFocusPadding must be used within a MapStateProvider');
    }

    return context;
};

const useStationsTypeSwitcher = (): ((type: StationInteractionType) => void) => {
    const dispatch = useMapDispatch();
    const { stationsType } = useMapState();

    return (type: StationInteractionType): void => {
        if (type !== stationsType) {
            dispatch({ type: 'SET_STATIONS_TYPE', payload: type });
        }
    };
};

const useStationsListOpener = (): ((payload: Partial<Record<StationInteractionType, boolean>>) => void) => {
    const dispatch = useMapDispatch();

    return (payload: Partial<Record<StationInteractionType, boolean>>): void => {
        dispatch({ type: 'SET_STATIONS_LIST_VISIBILITY', payload });
    };
};

/**
 * - If user hasn't closed/opened the map (isMapOpen === null)
 * - If the map is one way (search && search.isOneWay)
 * - If it is on desktop (!tabletOrSmaller)
 *
 * Then the map is open
 */
const isMapOpen = (): boolean => {
    const tabletOrSmaller = isTabletOrSmaller();
    return useReduxState(({ search, isMapOpen }) => {
        if (isMapOpen !== null) {
            return isMapOpen;
        }

        return Boolean(search && search.isOneWay && !tabletOrSmaller);
    });
};

const useMapOpener = (): ((open: boolean) => void) => {
    const isOpen = isMapOpen();
    const loadMapData = useReduxState(s => s.loadMapData);
    const dispatch = useReduxDispatch();

    return (open: boolean): void => {
        if (open !== isOpen || (isOpen && !loadMapData)) {
            dispatch(openMap(open));
        }
    };
};

const useStationUnfocus = (): (() => void) => {
    const dispatch = useMapDispatch();
    const { focusedStationId } = useMapState();
    const padding = useFocusPadding();

    return (): void => {
        if (!focusedStationId || Date.now() < padding.unfocusBlock) {
            return;
        }

        dispatch({ type: 'FOCUS_STATION', payload: { focusedStationId: null } });
    };
};

const useBaseStationFocus = (
    availableIdsMapper: (map: Map<string, string>, station: FilterOption<Station>) => Map<string, string>,
): ((stationId: string, type: StationInteractionType) => void) => {
    const { focusedStationId, stationsType } = useMapState();

    const availabeIds = useReduxState(
        ({ filters: { pickUpStations, dropOffStations } }) =>
            [...pickUpStations, ...dropOffStations].reduce<Map<string, string>>(availableIdsMapper, new Map()),
        (l, r) => l.size !== r.size,
    );

    const padding = useFocusPadding();
    const unfocus = useStationUnfocus();
    const openMap = useMapOpener();
    const dispatch = useMapDispatch();

    return (rateStationId: string, type: StationInteractionType): void => {
        const stationId = availabeIds.get(rateStationId) || null;

        if (stationId === focusedStationId && stationsType === type) {
            return;
        }

        if (!stationId) {
            unfocus();
            return;
        }

        /**
         * Block unfocus in the near future
         */
        padding.unfocusBlock = Date.now() + UNFOCUS_BLOCK_TIMEOUT;

        // Open the map, switch to new navigation tab, focus on particular station
        openMap(true);
        dispatch({ type: 'FOCUS_STATION', payload: { focusedStationId: stationId, stationsType: type } });
    };
};

/**
 * This hook should be called if you wish to focus on a station by their ungrouped id (Station.ids)
 */
const useRateStationFocus = (): ((stationId: string, type: StationInteractionType) => void) =>
    useBaseStationFocus((ids, station) => station.value.ids.reduce((ids, id) => ids.set(id, station.id), ids));

/**
 * This hook should be called if you wish to focus on a station by their grouped id (Station.id)
 */
const useStationFocus = (): ((stationId: string, type: StationInteractionType) => void) =>
    useBaseStationFocus((ids, station) => ids.set(station.id, station.id));

const useStation = (): [
    MapContextState['focusedStationId'],
    ReturnType<typeof useStationFocus>,
    ReturnType<typeof useStationUnfocus>,
] => [useMapState().focusedStationId, useStationFocus(), useStationUnfocus()];

const useStationsType = (): [MapContextState['stationsType'], ReturnType<typeof useStationsTypeSwitcher>] => [
    useMapState().stationsType,
    useStationsTypeSwitcher(),
];

const useMap = (): [boolean, ReturnType<typeof useMapOpener>] => [isMapOpen(), useMapOpener()];

export {
    MapStateProvider,
    useMapState,
    useMapOpener,
    useStationsType,
    useStationsListOpener,
    useRateStationFocus,
    useStation,
    useMap,
};
