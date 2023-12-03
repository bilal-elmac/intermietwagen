import { Provider } from '../../domain/Provider';

import { HCRatesApiConfigurationResponse, ProviderResponse } from '../response/HCRatesApiResponse';

export const mapProvider = (
    { id, name }: Pick<ProviderResponse, 'id' | 'name' | 'image'>,
    logos?: HCRatesApiConfigurationResponse['providersConfiguration']['logos'],
): Provider => ({
    id,
    name,
    logoUrl: (logos && logos[id] && logos[id].overwriteSupplierImage && logos[id].logoUrl) || null,
});
