import { MaxPassengersFilterResponse } from '../../response/HCRatesApiResponse';

import { FilterMapper, FilterStrategy } from './Mapper';

export const seatsMapper: FilterMapper<MaxPassengersFilterResponse, number, number, 'seats'> = {
    filterName: 'seats',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => response.maximumpassengers,
    mapResponseToId: response => String(response.maximumpassengers),
    type: FilterStrategy.OR,
};
