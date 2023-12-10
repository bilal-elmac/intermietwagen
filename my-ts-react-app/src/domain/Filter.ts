import { PriceRange } from './Price';
import { PackageType, OfferPackageFeature } from './OfferPackage';
import { Provider } from './Provider';
import { Supplier } from './Supplier';
import { Station } from './Station';
import { Mutable } from '../utils/TypeUtils';

export interface FilterOption<V> {
    readonly id: string;

    /**
     * Null -> user hasn't touched it
     * boolean -> user has previously selected
     */
    readonly selected: boolean | null;
    readonly disabled: boolean;
    readonly value: V;
    readonly prices: PriceRange;
}

export interface Highlightable {
    readonly highlight: boolean;
}

export type VehicleCategory =
    | 'MINI'
    | 'ECONOMY'
    | 'COMPACT'
    | 'MIDDLE_INTERMEDIATE'
    | 'FULLSIZED_CLASS'
    | 'PREMIUM_CLASS'
    | 'CABRIO'
    | 'STATION_WAGON'
    | 'VAN'
    | 'SUV'
    | 'TRANSPORTER'
    | 'PICKUP';

export type CarFeatureType =
    | 'AIR_CONDITIONER'
    | 'AUTOMATIC'
    | 'WINTER_TIRES'
    | 'FOUR_WHEELS'
    | 'DIESEL'
    | 'FULL_TO_FULL_FUEL_POLICY'
    | 'ADDITIONAL_DRIVER'
    | 'UNLIMITED_DISTANCE'
    | 'CAR_MODEL_GUARANTEE'
    | 'HYBRID'
    | 'ELECTRIC';

export type InsuranceType =
    | 'CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY'
    | 'GLASS_AND_TIRE'
    | 'UNDERBODY'
    | 'RATE_WITH_TPL_MINIMUM_COVERAGE';

// To be used as a filter
export type PaymentMethod = 'AMEX' | 'MASTERCARD' | 'VISA';

export type PackageRelatedFilterValues = CarFeatureType | InsuranceType;
export type PackageRelatedFilters = {
    [key in Extract<keyof Filters, 'features' | 'insurances'>]: PackageRelatedFilterValues[];
};
export interface OfferPackage {
    readonly type: PackageType;
    readonly features: OfferPackageFeature[];
    readonly imageUrl: string | null;
    readonly relatedFilters: PackageRelatedFilters;
}

export interface Airport {
    readonly iata: string;
    readonly name: string | null;
}

export interface Neighborhood {
    readonly pickupType: PickupType | null;
    readonly name: string;
}

export type PickupType = 'MEET_AND_GREET' | 'DESK_AT_PLACE' | 'SHUTTLE';

export interface Filters {
    readonly packages: FilterOption<OfferPackage>[];

    readonly insurances: FilterOption<InsuranceType>[];
    readonly vehicleCategories: FilterOption<VehicleCategory>[];

    readonly pickUpStations: FilterOption<Station<'pickUp'>>[];
    readonly dropOffStations: FilterOption<Station<'dropOff'>>[];

    readonly airports: FilterOption<Airport>[];
    readonly pickupTypes: FilterOption<PickupType>[];
    readonly neighborhoods: FilterOption<Neighborhood>[];

    readonly seats: FilterOption<number>[];
    readonly features: FilterOption<CarFeatureType>[];

    readonly paymentMethods: FilterOption<PaymentMethod>[];
    readonly suppliers: FilterOption<Supplier & Highlightable>[];
    readonly providers: FilterOption<Provider>[];
}

export const arePartiallyLoaded = (filters: Filters): boolean =>
    Object.values(filters).some((options: FilterOption<unknown>[]): boolean => options.length > 0);

export const areAnySelected = (filters: Filters): boolean =>
    Object.values(filters).some((options: FilterOption<unknown>[]): boolean => options.some(o => o.selected !== null));

export const getSelectedCount = ({ seats, ...checkBoxFilters }: Filters): number => {
    return (
        // seats filter sets selected=true to all options with a value higher than selected
        // need to count it as 1 selected option
        Number(seats.some(o => o.selected)) +
        Object.values(checkBoxFilters).reduce(
            (r, options: FilterOption<unknown>[]): boolean => r + options.reduce((c, o) => c + Number(o.selected), 0),
            0,
        )
    );
};

export const hasSelectedFilters = (filters: Filters): boolean => getSelectedCount(filters) > 0;

/**
 * Returns unselected filters
 * @param {Filters} filters - all filters
 * @param {keyof Filters} [filterName] - filter to clear. If not passed, clear all filters
 */
export const getClearedFilters = (filters: Filters, filterNameToClear?: keyof Filters): Filters =>
    Object.entries(filters).reduce((filters, [filterName, options]) => {
        if ((filterNameToClear && filterName === filterNameToClear) || !filterNameToClear) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filters[filterName as keyof Filters] = (options as FilterOption<any>[]).map(o => ({
                ...o,
                selected: null,
            }));
        } else {
            filters[filterName as keyof Filters] = options;
        }
        return filters;
    }, {} as Mutable<Filters>);

export const packageFilterOpton = (filters: Filters, type: PackageType): FilterOption<OfferPackage> | null =>
    filters.packages.find(filter => filter.value.type === type) || null;

export const hasSelectedPackage = (filters: Filters): boolean => filters.packages.some(filter => filter.selected);

export const areAllPackagesAvailable = (filters: Filters): boolean =>
    filters.packages.length === Object.values(PackageType).length;
