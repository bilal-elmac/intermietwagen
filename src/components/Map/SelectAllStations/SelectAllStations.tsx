import React from 'react';
import { LatLngBounds } from 'leaflet';
import { FormattedMessage } from 'react-intl';

import { AvailableStation } from '../MapDomain';
import { StationInteractionType } from '../../../domain/Station';

import { useReduxDispatch } from '../../../reducers/Actions';
import { updateFilters } from '../../../reducers/FilterActions';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';
import { useMapBounds } from '../MapView/BoundUtilts';

import Button from '../../../ui/Button';

export interface SelectAllArgs {
    readonly stations: AvailableStation[];
    readonly stationType: StationInteractionType;
    // Set in tests
    readonly bounds?: LatLngBounds | null;
}

export const SelectAllStationsBtn: React.FC<SelectAllArgs> = ({
    stations,
    stationType,
    bounds = useMapBounds(),
}): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const isMobile = isTabletOrSmaller();

    const visibleStations =
        bounds &&
        stations.reduce<AvailableStation['option'][]>((reduced, { option, lat, lng }) => {
            if (!option.selected && bounds.contains([lat, lng])) {
                reduced.push({ ...option, selected: true });
            }
            return reduced;
        }, []);

    if (!Array.isArray(visibleStations) || visibleStations.length === 0) {
        return null;
    }

    const filterName = stationType === 'dropOff' ? 'dropOffStations' : 'pickUpStations';

    return (
        <div className="hc-results-view__map__button-select-all-wrapper">
            <Button
                id="hc-results-view__map__button-select-all"
                name="hc-results-view__map__button-select-all"
                className="hc-results-view__map__button-select-all"
                onClick={(): void => {
                    dispatch(updateFilters(filterName, visibleStations));
                }}
                version="inverted"
            >
                <FormattedMessage id="LABEL_SELECT_ALL_MAP_STATIONS_BTN" values={{ isMobile }} />
            </Button>
        </div>
    );
};
