import deepmerge from 'deepmerge';

import { Filters, FilterOption } from '../../../domain/Filter';

import { FilterMapper, FilterOptionValue } from './Mapper';

import { HCRatesApiFilterRequest, FilterResponse } from '../../response/HCRatesApiResponse';

import { pickUpStationsMapper, dropOffStationsMapper } from './Branches';
import { providersMapper } from './Providers';
import { iatasMapper } from './Iatas';
import { vehicleCategoriesMapper } from './VehicleCategories';
import { paymentTypesMapper } from './PaymentTypes';
import { suppliersMapper } from './Suppliers';
import { pickupTypesMapper } from './PickupTypes';
import { seatsMapper } from './Seats';
import { carFeaturesMapper } from './CarFeatures';
import { packagesMapper } from './Packages';
import { insurancesMapper } from './Insurances';

const mapFilterRequest = <R extends FilterResponse, I, V extends FilterOptionValue<F>, F extends keyof Filters>(
    { filterName, mapFilterOptionToRequest }: FilterMapper<R, I, V, F>,
    filters: Filters,
): I[] => {
    const options = (filters[filterName] as unknown) as FilterOption<V>[];
    return options.reduce((s: I[], o) => (o.selected ? [...s, mapFilterOptionToRequest(o)] : s), []);
};

export const mapFiltersRequest = (filters: Filters): HCRatesApiFilterRequest => {
    return deepmerge.all<HCRatesApiFilterRequest>([
        ...mapFilterRequest(carFeaturesMapper, filters),
        ...mapFilterRequest(insurancesMapper, filters),
        {
            carTypes: mapFilterRequest(vehicleCategoriesMapper, filters),
            iatas: mapFilterRequest(iatasMapper, filters),
            passengers: mapFilterRequest(seatsMapper, filters).sort()[0],
            paymentTypes: mapFilterRequest(paymentTypesMapper, filters),
            pickupTypes: mapFilterRequest(pickupTypesMapper, filters),
            providers: mapFilterRequest(providersMapper, filters),
            suppliers: mapFilterRequest(suppliersMapper, filters),
            packages: mapFilterRequest(packagesMapper, filters),
            pickupBranches:
                mapFilterRequest(pickUpStationsMapper, filters)
                    .reduce<string[]>((a, b) => [...a, ...b], [])
                    .join(',') || undefined,
            dropoffBranches:
                mapFilterRequest(dropOffStationsMapper, filters)
                    .reduce<string[]>((a, b) => [...a, ...b], [])
                    .join(',') || undefined,
        },
    ]);
};
