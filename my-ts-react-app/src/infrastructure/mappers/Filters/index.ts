import { Filters } from '../../../domain/Filter';

import { FiltersResponse, HCRatesApiConfigurationResponse, HCMapResponse } from '../../response/HCRatesApiResponse';

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
import { mergeChanges } from './Changes';

export { mapFiltersRequest } from './Request';
export { mapFiltersBaseline } from './Baseline';

/**
 * @param filtersBaseline - The Filters with the most options/lowest prices
 * @param userSelection - The Filters with the latest selection from the user
 * @param newFilters - The Backend FiltersResponse with the filtered prices/disabled filters
 */
export const mapApiFiltersResponse = ({
    filtersBaseline: {
        packages: packagesBaseline,

        insurances: insurancesBaseline,
        vehicleCategories: vehicleCategoriesBaseline,

        airports: airportsBaseline,
        pickupTypes: pickupTypesBaseline,
        neighborhoods: neighborhoodsBaseline,

        dropOffStations: dropOffStationsBaseline,
        pickUpStations: pickUpStationsBaseline,

        seats: seatsBaseline,
        features: featuresBaseline,

        paymentMethods: paymentMethodsBaseline,
        suppliers: suppliersBaseline,
        providers: providersBaseline,
    },
    userSelection: {
        packages: packagesSelection,

        insurances: insurancesSelection,
        vehicleCategories: vehicleCategoriesSelection,

        airports: airportsSelection,
        pickupTypes: pickupTypesSelection,

        dropOffStations: dropOffStationsSelection,
        pickUpStations: pickUpStationsSelection,

        seats: seatsSelection,
        features: featuresSelection,

        paymentMethods: paymentMethodsSelection,
        suppliers: suppliersSelection,
        providers: providersSelection,
    },
    newFilters: {
        cheapestByPickUpBranch: newPickUpBranches,
        cheapestByDropOffBranch: newDropOffBranches,

        pickupbranchidsList: newPickupBranchIds,
        dropoffbranchidsList: newDropoffBranchIds,

        providersList: newProviders,
        cartypesList: newCarTypes,
        paymenttypesList: newPaymentTypes,
        pickuptypesList: newPickupTypes,
        iatasList: newIatasList,
        maximumpassengersList: newMaxPassengersList,
        suppliersList: newSuppliersList,
        equipmentsList: newEquipmentsList,
        conditionalfeesList: newConditionalfeesList,
        additionalsList: newAdditionalsList,
        happycarpackagesList: newPakagesList,
        coveragesList: newCoveragesList,
    },
    lastAppliedFilter,
    configuration: { currencyCode, packages: packagesConfiguration, defaultImageUrl },
}: {
    filtersBaseline: Filters;
    userSelection: Filters;
    newFilters: FiltersResponse & HCMapResponse;
    lastAppliedFilter: keyof Filters | null;
    configuration: Pick<HCRatesApiConfigurationResponse, 'currencyCode' | 'packages' | 'defaultImageUrl'>;
}): Filters => {
    const lastApplied = new Set<keyof Filters>(lastAppliedFilter ? [lastAppliedFilter] : []);

    return {
        packages: mergeChanges({
            response: mergePackages(newPakagesList, packagesConfiguration, defaultImageUrl),
            selection: packagesSelection,
            baseline: packagesBaseline,
            lastApplied,
            mapper: packagesMapper,
            currencyCode,
        }),

        insurances: mergeChanges({
            response: mergeCoverageTypes([...newCoveragesList, ...newAdditionalsList]),
            selection: insurancesSelection,
            baseline: insurancesBaseline,
            lastApplied,
            mapper: insurancesMapper,
            currencyCode,
        }),

        vehicleCategories: mergeChanges({
            response: newCarTypes,
            selection: vehicleCategoriesSelection,
            baseline: vehicleCategoriesBaseline,
            lastApplied,
            mapper: vehicleCategoriesMapper,
            currencyCode,
        }),

        pickupTypes: mergeChanges({
            response: newPickupTypes,
            selection: pickupTypesSelection,
            baseline: pickupTypesBaseline,
            lastApplied,
            mapper: pickupTypesMapper,
            currencyCode,
        }),

        airports: mergeChanges({
            response: newIatasList,
            selection: airportsSelection,
            baseline: airportsBaseline,
            lastApplied,
            mapper: iatasMapper,
            currencyCode,
        }),

        neighborhoods: neighborhoodsBaseline,

        pickUpStations: mergeChanges({
            response: mergeMapBranchesFilterOptions(newPickUpBranches, newPickupBranchIds, 'pickUp'),
            selection: pickUpStationsSelection,
            baseline: pickUpStationsBaseline,
            lastApplied,
            mapper: pickUpStationsMapper,
            currencyCode,
        }),

        dropOffStations: mergeChanges({
            response: mergeMapBranchesFilterOptions(newDropOffBranches, newDropoffBranchIds, 'dropOff'),
            selection: dropOffStationsSelection,
            baseline: dropOffStationsBaseline,
            lastApplied,
            mapper: dropOffStationsMapper,
            currencyCode,
        }),

        seats: mergeChanges({
            response: newMaxPassengersList,
            selection: seatsSelection,
            baseline: seatsBaseline,
            lastApplied,
            mapper: seatsMapper,
            currencyCode,
        }),

        features: mergeChanges({
            response: [...newEquipmentsList, ...newConditionalfeesList, ...newAdditionalsList],
            selection: featuresSelection,
            baseline: featuresBaseline,
            lastApplied,
            mapper: carFeaturesMapper,
            currencyCode,
        }),

        paymentMethods: mergeChanges({
            response: newPaymentTypes,
            selection: paymentMethodsSelection,
            baseline: paymentMethodsBaseline,
            lastApplied,
            mapper: paymentTypesMapper,
            currencyCode,
        }),

        suppliers: mergeChanges({
            response: newSuppliersList,
            selection: suppliersSelection,
            baseline: suppliersBaseline,
            lastApplied,
            mapper: suppliersMapper,
            currencyCode,
        }),

        providers: mergeChanges({
            response: newProviders,
            selection: providersSelection,
            baseline: providersBaseline,
            lastApplied,
            mapper: providersMapper,
            currencyCode,
        }),
    };
};
