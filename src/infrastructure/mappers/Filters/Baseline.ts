import { Filters, FilterOption } from '../../../domain/Filter';

import { FilterMapper, RequiredFilterResponse, FilterOptionValue } from './Mapper';

import { FiltersResponse, HCRatesApiConfigurationResponse, HCMapResponse } from '../../response/HCRatesApiResponse';

import { createPrice, mapLowestPrice } from '../Price';

import { mergeMapBranchesFilterOptions, pickUpStationsMapper, dropOffStationsMapper } from './Branches';
import { providersMapper } from './Providers';
import { iatasMapper } from './Iatas';
import { vehicleCategoriesMapper } from './VehicleCategories';
import { paymentTypesMapper } from './PaymentTypes';
import { suppliersMapper } from './Suppliers';
import { pickupTypesMapper } from './PickupTypes';
import { seatsMapper } from './Seats';
import { carFeaturesMapper } from './CarFeatures';
import { packagesMapper, mergePackages } from './Packages';
import { insurancesMapper, mergeCoverageTypes } from './Insurances';

const mapFilterBaseline = <
    R extends RequiredFilterResponse,
    I,
    V extends FilterOptionValue<F>,
    F extends keyof Filters
>({
    currencyCode,
    mapper,
    response,
    forceSelection,
}: {
    currencyCode: string;
    mapper: FilterMapper<R, I, V, F>;
    response: R[];
    forceSelection: Map<keyof Filters, string[]> | null;
}): FilterOption<V>[] => {
    // This should come in not null only at the load of the application
    const forcedOptions = (forceSelection && forceSelection.get(mapper.filterName)) || null;
    const indexedSelectedIds = forcedOptions ? new Set<string>(forcedOptions) : null;

    const indexed = response.reduce((indexed, response) => {
        const value = mapper.mapResponseToValue(response);
        const id = mapper.mapResponseToId(response);

        // Multiple options can be mapped into the same id
        if (value && id) {
            const [previousMinPrice] = indexed.get(id) || [Infinity, null];
            // The value can just be ovewritten, as it should be the same
            indexed.set(id, [mapLowestPrice(previousMinPrice, response.minprice), value]);
        }

        return indexed;
    }, new Map<string, [number, V]>());

    return Array.from(indexed).map(([id, [minPrice, value]]) => ({
        id,
        selected: indexedSelectedIds === null ? null : indexedSelectedIds.has(id),
        disabled: minPrice === 0,
        value,
        prices: [minPrice ? createPrice({ currencyCode: currencyCode, value: minPrice }) : null, null],
    }));
};

interface Args {
    readonly filtersResponse: FiltersResponse;
    readonly mapResponse: HCMapResponse;
    readonly forceSelection: Map<keyof Filters, string[]> | null;
    readonly configuration: HCRatesApiConfigurationResponse;
}

export const mapFiltersBaseline = ({
    filtersResponse: {
        providersList,
        suppliersList,
        paymenttypesList,
        maximumpassengersList,
        cartypesList,
        iatasList,
        pickuptypesList,
        equipmentsList,
        conditionalfeesList,
        additionalsList,
        happycarpackagesList,
        pickupbranchidsList,
        dropoffbranchidsList,
        coveragesList,
    },
    mapResponse: { cheapestByPickUpBranch, cheapestByDropOffBranch },
    forceSelection,
    configuration: { currencyCode, packages: packagesConfiguration, defaultImageUrl },
}: Args): Filters => {
    return {
        packages: mapFilterBaseline({
            currencyCode,
            mapper: packagesMapper,
            response: mergePackages(happycarpackagesList, packagesConfiguration, defaultImageUrl),
            forceSelection,
        }),

        insurances: mapFilterBaseline({
            currencyCode,
            mapper: insurancesMapper,
            response: mergeCoverageTypes([...coveragesList, ...additionalsList]),
            forceSelection,
        }),

        airports: mapFilterBaseline({
            currencyCode,
            mapper: iatasMapper,
            response: iatasList,
            forceSelection,
        }),

        pickupTypes: mapFilterBaseline({
            currencyCode,
            mapper: pickupTypesMapper,
            response: pickuptypesList,
            forceSelection,
        }),

        neighborhoods: [],

        pickUpStations: mapFilterBaseline({
            currencyCode,
            mapper: pickUpStationsMapper,
            response: mergeMapBranchesFilterOptions(cheapestByPickUpBranch, pickupbranchidsList, 'pickUp'),
            forceSelection,
        }),

        dropOffStations: mapFilterBaseline({
            currencyCode,
            mapper: dropOffStationsMapper,
            response: mergeMapBranchesFilterOptions(cheapestByDropOffBranch, dropoffbranchidsList, 'dropOff'),
            forceSelection,
        }),

        seats: mapFilterBaseline({
            currencyCode,
            mapper: seatsMapper,
            response: maximumpassengersList,
            forceSelection,
        }),

        vehicleCategories: mapFilterBaseline({
            currencyCode,
            mapper: vehicleCategoriesMapper,
            response: cartypesList,
            forceSelection,
        }),

        paymentMethods: mapFilterBaseline({
            currencyCode,
            mapper: paymentTypesMapper,
            response: paymenttypesList,
            forceSelection,
        }),

        features: mapFilterBaseline({
            currencyCode,
            mapper: carFeaturesMapper,
            response: [...equipmentsList, ...conditionalfeesList, ...additionalsList],
            forceSelection,
        }),

        suppliers: mapFilterBaseline({
            currencyCode,
            mapper: suppliersMapper,
            response: suppliersList,
            forceSelection,
        }),

        providers: mapFilterBaseline({
            currencyCode,
            mapper: providersMapper,
            response: providersList,
            forceSelection,
        }),
    };
};
