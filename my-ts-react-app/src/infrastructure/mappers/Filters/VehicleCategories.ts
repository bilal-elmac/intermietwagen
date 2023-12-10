import { VehicleCategory } from '../../../domain/Filter';

import { CarTypeFilterResponse } from '../../response/HCRatesApiResponse';

import { FilterMapper, FilterStrategy } from './Mapper';
import vehicleTypeMap from '../VehicleTypesMap';

export const vehicleCategoriesMapper: FilterMapper<
    CarTypeFilterResponse,
    number,
    VehicleCategory,
    'vehicleCategories'
> = {
    filterName: 'vehicleCategories',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => vehicleTypeMap.get(response.cartype) || null,
    mapResponseToId: response => String(response.cartype),
    type: FilterStrategy.OR,
};
