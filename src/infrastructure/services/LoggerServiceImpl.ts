import { LoggerService, AutocompleteLogInfo, FeeLogInfo, OfferLogInfo } from '../../services/LoggerService';
import { RVError } from '../../domain/Error';
import { Language } from '../../domain/Configuration';

export class LoggerServiceImpl implements LoggerService {
    private readonly language: Language;
    private ratesearchKey: string;

    constructor(language: Language) {
        this.language = language;
        this.ratesearchKey = 'Not loaded';
    }

    setRateSearchKey(ratesearchKey: string): void {
        this.ratesearchKey = ratesearchKey;
    }

    error(error: RVError): void {
        console.error('An error has ocurred', error, this.ratesearchKey);
    }

    log(message: string, extra: { [key: string]: unknown }): void {
        console.warn(message, extra, this.ratesearchKey);
    }

    logOfferMappingError({ rateId, providerId, error }: OfferLogInfo): void {
        console.warn('Could not map offer', { rateSearchKey: this.ratesearchKey, rateId, providerId, error });
    }

    logNegativePriceFee({ rateId, providerId, feeType }: FeeLogInfo): void {
        console.warn('Fee has negative price', { rateId, providerId, feeType });
    }

    logAutocompleteError(info: AutocompleteLogInfo): void {
        console.warn(`Could not use autocomplete suggestion for languages '${this.language}`, info, this.ratesearchKey);
    }
}
