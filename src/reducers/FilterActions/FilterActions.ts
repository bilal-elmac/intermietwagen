import { Dispatch } from 'redux';

import { Unarray } from '../../utils/TypeUtils';

import {
    FilterOption,
    Filters,
    getClearedFilters,
    OfferPackage,
    PackageRelatedFilters,
    PackageRelatedFilterValues,
} from '../../domain/Filter';
import { AppState } from '../../domain/AppState';
import { SortStatus } from '../../domain/SortStatus';

import { ActionType, DispatchAction, ActionCreator } from '../Actions';
import { INITIAL_PAGE } from '../InitialState';

type GenericFilterOption<F extends keyof Filters> = FilterOption<Unarray<Filters[F]>['value']>;

export const createFilterDispatchAction = (
    { currentPage, ...state }: Partial<AppState>,
    lastAppliedFilter: keyof Filters | null = null,
): DispatchAction => ({
    type: ActionType.UpdateFilters,
    payload: {
        ...state,
        /**
         * Whatever was selected previously can be dropped
         *
         * It was either already partially in effect,
         * Or the user wishes to overwrite it
         */
        forceSelection: null,
        currentPage: currentPage || INITIAL_PAGE,
        lastAppliedFilter,
        loadedBuffer: null,
    },
});

const optionsSwitcher = <O extends FilterOption<T>, T>(options: O[], newOptions: O[]): O[] => {
    const indexedNewOptions = newOptions.reduce<{ [s: string]: O }>(
        (base, newOption) => ({ ...base, [newOption.id]: newOption }),
        {},
    );

    return options.map(oldOption => indexedNewOptions[oldOption.id] || oldOption);
};

/**
 * Updates single filter options
 *
 * The generics force the filterName and option types to match
 */
export const updateFilters = <O extends GenericFilterOption<F>, F extends keyof Filters>(
    filterName: F,
    updatedOptions: O[],
) => (dispatch: Dispatch<DispatchAction>, getState: () => AppState): DispatchAction => {
    const { filters } = getState();
    const options = filters[filterName] as O[];

    /**
     * Unselect selected package if related filter option is unselected
     */
    let relatedFilters = {};
    const selectedPackage = filters.packages.find(item => item.selected);
    if (selectedPackage) {
        // get new unselected filter options relating to packages
        const relatedFilterOptions = Object.values(selectedPackage.value.relatedFilters)
            .flat()
            .reduce(
                (related, option) => [
                    ...related,
                    ...updatedOptions.filter(({ value, selected }) => value === option && !selected),
                ],
                [] as O[],
            );

        const shouldChangePackages = relatedFilterOptions.length > 0;
        if (shouldChangePackages) {
            relatedFilters = {
                packages: optionsSwitcher(filters.packages, [{ ...selectedPackage, selected: false }]),
            };
        }
    }

    return dispatch(
        createFilterDispatchAction(
            {
                filters: {
                    ...filters,
                    [filterName]: optionsSwitcher(options, updatedOptions),
                    ...relatedFilters,
                },
            },
            filterName,
        ),
    );
};

/**
 * Set up logic for packages filters
 */
export const updatePackageFilter: (packageData: FilterOption<OfferPackage>) => ActionCreator = (
    packageData: FilterOption<OfferPackage>,
) => (dispatch: Dispatch<DispatchAction>, getState: () => AppState): DispatchAction => {
    const {
        filters: { packages: oldPackages, ...otherFilters },
    } = getState();
    const prevPackage = oldPackages.find(item => item.selected);
    const prevOptions = prevPackage ? Object.values(prevPackage.value.relatedFilters).flat() : [];
    // if a package is clicked, reset others to selected: false
    const updatedPackages: FilterOption<OfferPackage>[] = oldPackages.map(item => ({ ...item, selected: false }));
    // update state for clicked package
    const newPackages = optionsSwitcher(updatedPackages, [packageData]);

    // update related filters
    const { relatedFilters } = packageData.value;
    const filtersToUpdate = Object.keys(relatedFilters) as Array<keyof PackageRelatedFilters>;
    // find only those options which are related to packages
    const newFilters = filtersToUpdate.reduce((updatedFilters, key: keyof PackageRelatedFilters) => {
        const newFilter = {
            [key]: (otherFilters[key] as FilterOption<PackageRelatedFilterValues>[]).map(
                (option: FilterOption<PackageRelatedFilterValues>) => ({
                    // change selected value only for options related to packages
                    // keep the selected value for other filter options
                    ...option,
                    selected: relatedFilters[key].includes(option.value)
                        ? packageData.selected
                        : prevOptions.includes(option.value)
                        ? false
                        : option.selected,
                }),
            ),
        };
        return {
            ...updatedFilters,
            [key]: optionsSwitcher(otherFilters[key] as FilterOption<PackageRelatedFilterValues>[], newFilter[key]),
        };
    }, {});

    return dispatch(
        createFilterDispatchAction(
            {
                filters: {
                    ...otherFilters,
                    ...newFilters,
                    packages: newPackages,
                },
            },
            'packages',
        ),
    );
};

export const clearFilters: (filterName?: keyof Filters) => ActionCreator = filterName => (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
): DispatchAction => {
    const { filters } = getState();
    const clearedFilters = getClearedFilters(filters, filterName);
    return dispatch(createFilterDispatchAction({ filters: clearedFilters, forceSelection: null }));
};

export const updateSorting = (sort: SortStatus): DispatchAction => createFilterDispatchAction({ sort });
export const updateCurrentPage = (currentPage: number): DispatchAction => createFilterDispatchAction({ currentPage });
