import { Provider } from '../../../domain/Provider';

import { ProviderFilterResponse } from '../../response/HCRatesApiResponse';
import { mapProvider } from '../Provider';
import { FilterMapper, FilterStrategy } from './Mapper';

export const providersMapper: FilterMapper<ProviderFilterResponse, number, Provider, 'providers'> = {
    filterName: 'providers',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => mapProvider(response.provider),
    mapResponseToId: response => String(response.provider.id),
    type: FilterStrategy.OR,
};
