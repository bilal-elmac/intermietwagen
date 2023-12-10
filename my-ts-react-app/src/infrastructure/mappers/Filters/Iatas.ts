import { Airport } from '../../../domain/Filter';

import { IataFilterResponse } from '../../response/HCRatesApiResponse';
import { FilterMapper, FilterStrategy } from './Mapper';
import { mapIata } from '../Iata';

export const iatasMapper: FilterMapper<IataFilterResponse, string, Airport, 'airports'> = {
    filterName: 'airports',
    mapFilterOptionToRequest: option => option.id,
    mapResponseToValue: response => {
        const iata = mapIata(response.iata);
        return iata ? { iata, name: null } : null;
    },
    mapResponseToId: response => response.iata,
    type: FilterStrategy.OR,
};
