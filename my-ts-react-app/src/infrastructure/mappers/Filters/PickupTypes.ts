import { PickupType } from '../../../domain/Filter';

import { PickUpTypeResponse, PickUpTypeFilterResponse } from '../../response/HCRatesApiResponse';

import { FilterMapper, FilterStrategy } from './Mapper';

const pickupTypeMap = new Map<PickUpTypeResponse, PickupType>([
    [PickUpTypeResponse.SHUTTLE, 'SHUTTLE'],
    [PickUpTypeResponse.MEET_AND_GREET, 'MEET_AND_GREET'],
    [PickUpTypeResponse.DESK_AT_PLACE, 'DESK_AT_PLACE'],
]);

export const pickupTypesMapper: FilterMapper<PickUpTypeFilterResponse, number, PickupType, 'pickupTypes'> = {
    filterName: 'pickupTypes',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => pickupTypeMap.get(response.pickuptype) || null,
    mapResponseToId: response => String(response.pickuptype),
    type: FilterStrategy.OR,
};
