import { FormattedMessage, useIntl } from 'react-intl';
import React from 'react';
import classNames from 'classnames';
import Sticky from 'react-stickynode';

import {
    FilterOption,
    PickupType,
    Airport,
    Neighborhood,
    arePartiallyLoaded,
    getSelectedCount,
    VehicleCategory,
} from '../../../domain/Filter';
import { StationInteractionType } from '../../../domain/Station';
import { willNeverHaveResults as selectWillNeverHaveResults } from '../../../domain/AppState';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';

import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';
import { updateFilters, clearFilters } from '../../../reducers/FilterActions';
import { useServices } from '../../../state/Services.context';
import { useMap } from '../../Map/Map.context';
import { useAirportName } from '../../../state/AirportNames';

import LeftSideFilter from '../LeftSide';
import { FilterPanel } from '../Panel/Panel';
import { StationsFilter } from '../Stations/StationFilter';
import { ExpandableChecklistFilter, ExpandableDropdownlistFilter } from '../Expandable';
import { CarCategoryIcon, CarFeaturesIcons } from '../MobileIcons';
import SelectedFilters from '../Selected';
import { ReducedOpenMapButton } from '../../Map';

import IconAdult from '../../../ui/IconAdult';
import PulseLoader, { WhitesmokePatch, TransparentPatch } from '../../../ui/PulseLoader';
import Delayed from '../../../ui/Delayed';
import JureStar from '../../../ui/JureStar';

import { useOverrideDisabled } from '../Utilts';
import { sortVehicleCategories } from '../VehicleCategoryUtils';
import { useMapDesktopToggler } from '../../Map/MapView/Utilts';

interface ReducedProps {
    compact?: boolean;
}

const CompactFilter: React.FC<{ readonly isCompact?: boolean }> = ({ isCompact, children }) => (
    <div className={classNames(isCompact && 'hc-compact-filter')}>{children}</div>
);

const ReducedInsurancesFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const { formatMessage } = useIntl();

    const insurances = useReduxState(({ filters: { insurances } }) => insurances);
    const overrideDisabled = useOverrideDisabled();

    if (insurances.length === 0) {
        return null;
    }

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                title="LABEL_FILTER_SECTION_INSURANCE"
                options={[
                    {
                        renderLabel: ({ value }): string => formatMessage({ id: `LABEL_FILTER_INSURANCE_${value}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('insurances', [updatedOption]));
                            analyticsService.onInsurancesFilterSelected(updatedOption.value);
                        },
                        options: insurances,
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

export const ReducedSelectedFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const selectedCount = useReduxState(({ filters }) => getSelectedCount(filters));

    if (!selectedCount) {
        return null;
    }

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <SelectedFilters
                onClearAll={(): void => {
                    dispatch(clearFilters());
                }}
            >
                <>
                    <FormattedMessage id="LABEL_FILTER_RESET" />
                    {selectedCount && ` (${selectedCount})`}
                </>
            </SelectedFilters>
        </CompactFilter>
    );
};

const ReducedStationsFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const search = useReduxState(s => s.search);
    const [pickUpStations, dropOffStations] = useReduxState(s => [
        s.filters.pickUpStations.filter(f => f.selected),
        s.filters.dropOffStations.filter(f => f.selected),
    ]);

    return (
        search && (
            <CompactFilter isCompact={Boolean(compact)}>
                <StationsFilter
                    pickupStations={pickUpStations}
                    dropOffStations={dropOffStations}
                    search={search}
                    onRemove={(station): void => {
                        const filterName =
                            station.value.interactionType === 'dropOff' ? 'dropOffStations' : 'pickUpStations';
                        dispatch(updateFilters(filterName, [{ ...station, selected: false }]));
                    }}
                    onReset={(stationType: StationInteractionType): void => {
                        const filterName = stationType === 'dropOff' ? 'dropOffStations' : 'pickUpStations';
                        dispatch(clearFilters(filterName));
                    }}
                />
            </CompactFilter>
        )
    );
};

const ReducedLocationsFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const { formatMessage } = useIntl();

    const airportLocations = useReduxState(state => state.filters.airports);
    const neighborhoods = useReduxState(state => state.filters.neighborhoods);
    const pickupTypes = useReduxState(state => state.filters.pickupTypes);
    const overrideDisabled = useOverrideDisabled();

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter<Neighborhood | Airport | PickupType>
                title="LABEL_FILTER_SECTION_PICKUP_STATIONS"
                options={[
                    {
                        renderLabel: ({ value }): string => {
                            const airport = value as Airport;
                            const airportName = airport.name || useAirportName(airport.iata);
                            return airportName ? `${airportName} (${airport.iata})` : airport.iata;
                        },
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('airports', [updatedOption as FilterOption<Airport>]));
                            if (updatedOption.selected) {
                                analyticsService.onLocationFilterSelected(true);
                            }
                        },
                        description: 'LABEL_LOCATION_FILTER_GROUP_AT_AIRPORT',
                        options: airportLocations,
                        overrideDisabled,
                    },
                    {
                        renderLabel: ({ value }): string => (value as Neighborhood).name,
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('neighborhoods', [updatedOption as FilterOption<Neighborhood>]));
                            if (updatedOption.selected) {
                                analyticsService.onLocationFilterSelected(false);
                            }
                        },
                        description: 'LABEL_LOCATION_FILTER_GROUP_IN_CITY',
                        options: neighborhoods,
                        overrideDisabled,
                    },
                    {
                        renderLabel: (o): string =>
                            formatMessage({ id: `LABEL_FILTER_OPTION_${o.value as PickupType}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('pickupTypes', [updatedOption as FilterOption<PickupType>]));
                        },
                        description: 'LABEL_LOCATION_FILTER_GROUP_PICKUP_TYPES',
                        options: pickupTypes.length > 1 ? pickupTypes : [],
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedComfortFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const comfortFeatures = useReduxState(s => s.filters.features);
    const overrideDisabled = useOverrideDisabled();
    const { formatMessage } = useIntl();

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                title="LABEL_FILTER_SECTION_COMFORT_OPTIONS"
                options={[
                    {
                        renderLabel: ({ value }): string => formatMessage({ id: `LABEL_FILTER_OPTION_${value}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('features', [updatedOption]));
                            if (updatedOption.selected) {
                                analyticsService.onCarFeaturesFilterSelected(updatedOption.value);
                            }
                        },
                        options: comfortFeatures,
                        hasIcons: isTabletOrSmaller(),
                        renderIcon: ({ value }): JSX.Element | null => CarFeaturesIcons[value],
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedCarCategoryFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const vehicleCategories = useReduxState(s => s.filters.vehicleCategories);
    const overrideDisabled = useOverrideDisabled();
    const { formatMessage } = useIntl();
    const renderIcon = ({ value }: { value: VehicleCategory }): JSX.Element | null => <CarCategoryIcon type={value} />;

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                title="LABEL_FILTER_SECTION_CAR_CATEGORY"
                options={[
                    {
                        renderLabel: ({ value }): string => formatMessage({ id: `LABEL_CAR_CATEGORY_${value}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('vehicleCategories', [updatedOption]));
                            if (updatedOption.selected) {
                                analyticsService.onVehicleCategoriesFilterSelected(updatedOption.value);
                            }
                        },
                        options: vehicleCategories,
                        renderIcon,
                        hasIcons: isTabletOrSmaller(),
                        sort: ([, { value: a }], [, { value: b }]): number => sortVehicleCategories(a, b),
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedSuppliersFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const suppliers = useReduxState(state => state.filters.suppliers);
    const overrideDisabled = useOverrideDisabled();

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                tooltip={{ tooltipContent: 'TOOLTIP_FILTER_SUPPLIERS_CONTENT' }}
                title="LABEL_FILTER_SECTION_SUPPLIERS"
                expandOnStart={false}
                options={[
                    {
                        renderLabel: ({ value }): string => value.name,
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('suppliers', [updatedOption]));
                            if (updatedOption.selected) {
                                analyticsService.onSuppliersFilterSelected(updatedOption.value);
                            }
                        },
                        options: suppliers,
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedProvidersFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const providers = useReduxState(state => state.filters.providers);
    const overrideDisabled = useOverrideDisabled();

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                tooltip={{ tooltipContent: 'TOOLTIP_FILTER_PROVIDERS_CONTENT' }}
                title="LABEL_FILTER_SECTION_PROVIDERS"
                expandOnStart={false}
                options={[
                    {
                        renderLabel: ({ value }): string => value.name,
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('providers', [updatedOption]));
                            if (updatedOption.selected) {
                                analyticsService.onProvidersFilterSelected(updatedOption.value);
                            }
                        },
                        options: providers,
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedPaymentMethodsFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const paymentMethods = useReduxState(state => state.filters.paymentMethods);
    const overrideDisabled = useOverrideDisabled();
    const { formatMessage } = useIntl();

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableChecklistFilter
                title="LABEL_FILTER_SECTION_PAYMENT_METHODS"
                tooltip={{
                    tooltipTitle: 'TOOLTIP_FILTER_PAYMENT_OPTIONS_TITLE',
                    tooltipContent: 'TOOLTIP_FILTER_PAYMENT_OPTIONS_CONTENT',
                }}
                options={[
                    {
                        renderLabel: ({ value }): string => formatMessage({ id: `LABEL_FILTER_OPTION_${value}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('paymentMethods', [updatedOption]));

                            if (updatedOption.selected) {
                                analyticsService.onPaymentMethodsFilterSelected(updatedOption.value);
                            }
                        },
                        options: paymentMethods,
                        overrideDisabled,
                    },
                ]}
            />
        </CompactFilter>
    );
};

const ReducedSeatsFilter: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const passengers = useReduxState(state => state.filters.seats);
    const overrideDisabled = useOverrideDisabled();
    const { formatMessage } = useIntl();

    if (passengers.length === 0) {
        return <></>;
    }

    const selectOption = (updatedOption: FilterOption<number> | null): void => {
        const value = (updatedOption && updatedOption.value) || Infinity;

        const newPassengers = passengers.map(passenger => ({
            ...passenger,
            selected: passenger.value >= value,
        }));

        dispatch(updateFilters('seats', newPassengers));

        if (isFinite(value)) {
            analyticsService.onPassengersFilterSelected(value);
        }
    };

    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <ExpandableDropdownlistFilter
                title="LABEL_FILTER_SECTION_PASSENGERS"
                customDropdownIcon={<IconAdult className="-m-1 h-9 mr-2" />}
                buttonTextWrapperClassName="text-dark-grey text-left"
                options={[
                    {
                        renderLabel: ({ value }): string =>
                            formatMessage({ id: 'LABEL_FILTER_OPTION_PASSENGERS' }, { min: value }),

                        onChange: (updatedOption): void => selectOption(updatedOption),
                        onReset: (): void => selectOption(null),
                        sort: ([, a], [, b]): number => (a.value > b.value ? 1 : -1),
                        options: passengers,
                        overrideDisabled,
                    },
                ]}
                defaultItems={[formatMessage({ id: 'LABEL_FILTER_OPTION_ADULTS_DEFAULT_OPTION' })]}
            />
        </CompactFilter>
    );
};

const LoadingFilter = ({ closed }: { closed?: boolean }): JSX.Element => (
    <>
        <TransparentPatch className="h-10" />
        {!closed && (
            <>
                <WhitesmokePatch className="h-1" />
                <TransparentPatch className="h-48" />
            </>
        )}
        <WhitesmokePatch className="h-4" />
    </>
);

const BASE_CLASS = 'hc-results-view__filter';

const FilterMapSection: React.FC<ReducedProps> = ({ compact }): JSX.Element => {
    const toggleMap = useMapDesktopToggler();
    const [isMapOpen] = useMap();
    return (
        <CompactFilter isCompact={Boolean(compact)}>
            <FilterPanel className={`${BASE_CLASS}__map-button mb-5`}>
                <div className="header w-full flex flex-wrap relative">
                    <JureStar />
                    <h3 className="title text-base ">
                        <FormattedMessage id="LABEL_SELECT_STATION" />
                    </h3>
                </div>
                <ReducedOpenMapButton
                    checked={isMapOpen}
                    onChange={(): void => {
                        toggleMap(!isMapOpen);
                    }}
                />
            </FilterPanel>
        </CompactFilter>
    );
};

export const FilterView = (): JSX.Element | null => {
    const hasFilters = useReduxState(state => arePartiallyLoaded(state.filters));
    const loadedTimes = useReduxState(s => s.loadedTimes);
    const willNeverHaveResults = useReduxState(selectWillNeverHaveResults);
    const isDesktop = !isTabletOrSmaller();

    return (
        <aside className={classNames(BASE_CLASS, willNeverHaveResults && `${BASE_CLASS}--no-results`)}>
            {!willNeverHaveResults && (
                <Delayed
                    timeout={100 + Math.random() * (hasFilters ? 400 : 100)}
                    contentKey={[hasFilters, loadedTimes].join('-')}
                >
                    <LeftSideFilter hasFilters={hasFilters}>
                        {!hasFilters ? (
                            <PulseLoader className="delay-6">
                                <LoadingFilter />
                                <LoadingFilter closed />
                                <LoadingFilter closed />
                                <LoadingFilter />
                                <LoadingFilter />
                                <LoadingFilter />
                                <LoadingFilter closed />
                                <LoadingFilter closed />
                                <LoadingFilter />
                                <LoadingFilter closed />
                            </PulseLoader>
                        ) : (
                            <>
                                <ReducedSelectedFilter />
                                {isDesktop && <FilterMapSection />}
                                <ReducedComfortFilter />
                                <ReducedInsurancesFilter />
                                <ReducedStationsFilter />
                                <ReducedLocationsFilter />
                                <ReducedCarCategoryFilter />
                                <ReducedSuppliersFilter />
                                <ReducedProvidersFilter />
                                <ReducedPaymentMethodsFilter />
                                <ReducedSeatsFilter />
                                <ReducedSelectedFilter />
                            </>
                        )}
                    </LeftSideFilter>
                    <Sticky
                        enabled={isDesktop}
                        activeClass={classNames(`${BASE_CLASS}--sticky`)}
                        innerClass={classNames(`${BASE_CLASS}__sticky-inner`)}
                    >
                        {({ status }): JSX.Element | null =>
                            status === Sticky.STATUS_FIXED ? (
                                <>
                                    <ReducedSelectedFilter compact />
                                    <FilterMapSection compact />
                                    <ReducedComfortFilter compact />
                                    <ReducedLocationsFilter compact />
                                </>
                            ) : null
                        }
                    </Sticky>
                </Delayed>
            )}
        </aside>
    );
};
