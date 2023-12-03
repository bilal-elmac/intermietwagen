import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { Collapse } from '@material-ui/core';

import { min } from '../../../../domain/Price';
import { FilterOption } from '../../../../domain/Filter';
import { StationInteractionType, Station } from '../../../../domain/Station';

import { Indexed } from '../../../../utils/TypeUtils';
import { isMobile } from '../../../../utils/MediaQueryUtils';

import { useReduxState, useReduxDispatch } from '../../../../reducers/Actions';
import { updateFilters, clearFilters } from '../../../../reducers/FilterActions';
import { useServices } from '../../../../state/Services.context';
import { useStationsListOpener, useMapState } from '../../Map.context';
import { useAirportName } from '../../../../state/AirportNames';

import IconMapPlace from '../../../../ui/IconMapPlace';
import { ChecklistFilter } from '../../../Filter/Checklist';
import { Header } from '../../../Filter/Panel';
import { MobileHeaderWrapper } from '../../../Header/MobileHeaderWrapper';
import { StationOption } from '../../../Filter/Stations/StationFilter';
import SelectedFilters from '../../../Filter/Selected';

type Stations = FilterOption<Station<StationInteractionType>>[];

type Args = {
    readonly type: StationInteractionType;
    readonly expanded: boolean;

    readonly selectedCount: number;
    readonly stations: Stations;

    readonly onChange: (option: FilterOption<Stations>) => void;
    readonly onClick?: () => void;

    readonly children: ReactNode;
};

const BASE_CLASS = 'hc-results-view__filter-panel';

const AirportSection: React.FC<Pick<Args, 'type' | 'onChange'>> = ({ type, onChange }): JSX.Element | null => {
    const airportStations = useReduxState(({ filters: { pickUpStations, dropOffStations } }) => {
        const stations: Stations = type === 'pickUp' ? pickUpStations : dropOffStations;
        return stations.reduce<Indexed<FilterOption<Stations>>>((indexed, station) => {
            const iata = station.value.iata;

            if (!iata || station.value.type !== 'airport' || station.disabled) {
                return indexed;
            }

            // Empty/previous option
            const previousStations = indexed[iata] || {
                selected: true,
                disabled: false,
                value: [],
                id: iata,
                prices: [null, null],
            };

            const [previousPrice] = previousStations.prices;
            const [newPrice] = station.prices;

            return {
                ...indexed,
                [iata]: {
                    ...previousStations,
                    value: [...previousStations.value, station],
                    selected: previousStations.selected && station.selected,
                    prices: [
                        previousPrice && newPrice ? min(previousPrice, newPrice) : previousPrice || newPrice,
                        null,
                    ],
                },
            };
        }, {});
    });

    const options = Object.values(airportStations).sort((a, b) => (a.id > b.id ? 1 : -1));
    if (!options.length) {
        return null;
    }

    return (
        <div className={`${BASE_CLASS}__content-container__shortcuts`}>
            <ChecklistFilter
                options={[
                    {
                        renderLabel: ({ id }): string => {
                            const airportName = useAirportName(id);
                            return airportName ? `${airportName} (${id})` : id;
                        },
                        onChange,
                        description: 'LABEL_STATIONS_AT_AIRPORT',
                        // So hooks are always called in the correct order
                        options,
                    },
                ]}
            />
        </div>
    );
};

const Content: React.FC<Pick<Args, 'type' | 'stations'>> = ({ type, stations }): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const filterName = type === 'pickUp' ? 'pickUpStations' : 'dropOffStations';

    const handleChange = (stations: FilterOption<Station<StationInteractionType>>[], selected: boolean): void => {
        dispatch(
            updateFilters(
                filterName,
                stations.map(station => ({ ...station, selected })),
            ),
        );

        if (!selected) {
            analyticsService.onStationRemoved(type);
            return;
        }
        if (stations.length > 1) {
            analyticsService.onMapAirportSelected(type);
        }
    };

    return (
        <div className={`${BASE_CLASS}__content-container`}>
            {stations.length > 0 && (
                <SelectedFilters
                    onClearAll={(): void => {
                        dispatch(clearFilters(filterName));
                    }}
                >
                    <FormattedMessage id="LABEL_RESET_STATIONS" />
                </SelectedFilters>
            )}
            <AirportSection
                type={type}
                onChange={(updatedOption): void => handleChange(updatedOption.value, Boolean(updatedOption.selected))}
            />
            <div className={`${BASE_CLASS}__content-container__options`}>
                {stations.map((station, k) => (
                    <StationOption key={k} station={station} onRemove={(): void => handleChange([station], false)} />
                ))}
            </div>
        </div>
    );
};

const SelectionHeader = ({
    type,
    selectedCount,
    expanded,
    onClick,
}: Pick<Args, 'type' | 'selectedCount' | 'expanded' | 'onClick'>): JSX.Element => (
    <Header
        onClick={onClick}
        expanded={expanded}
        description={<FormattedMessage id="SELECTED_MAP_STATIONS_DESCRIPTION" />}
        title={
            <div>
                <IconMapPlace />
                <FormattedMessage
                    id={`LABEL_${type.toUpperCase()}_STATIONS_WITH_COUNTER`}
                    values={{ counter: selectedCount }}
                />
            </div>
        }
    />
);

const Wrapper: React.FC<Pick<Args, 'type' | 'selectedCount' | 'children'>> = ({
    selectedCount,
    type,
    children,
}): JSX.Element | null => {
    const {
        isStationsListOpen: { [type]: expanded },
    } = useMapState();
    const stationsListOpener = useStationsListOpener();
    const mobile = isMobile();

    return mobile ? (
        <MobileHeaderWrapper
            open={expanded}
            handleChange={(): void => stationsListOpener({ [type]: !expanded })}
            backLabel="LABEL_BACK_TO_MAP"
        >
            <div className={`${BASE_CLASS} ${BASE_CLASS}--mobile`}>
                <SelectionHeader expanded={expanded} type={type} selectedCount={selectedCount} />
                {children}
            </div>
        </MobileHeaderWrapper>
    ) : (
        <div className={`${BASE_CLASS} ${BASE_CLASS}--collapsable`}>
            <SelectionHeader
                expanded={expanded}
                type={type}
                selectedCount={selectedCount}
                onClick={(): void => stationsListOpener({ [type]: !expanded })}
            />
            <Collapse in={expanded} timeout="auto">
                {children}
            </Collapse>
        </div>
    );
};

export const StationsList: React.FC<Pick<Args, 'type'>> = ({ type }): JSX.Element | null => {
    const stations = useReduxState(s =>
        type === 'pickUp'
            ? s.filters.pickUpStations.filter(f => f.selected)
            : s.filters.dropOffStations.filter(f => f.selected),
    );

    return (
        <Wrapper type={type} selectedCount={stations.length}>
            <Content type={type} stations={stations} />
        </Wrapper>
    );
};
