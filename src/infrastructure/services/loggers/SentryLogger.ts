import { init, captureException, captureMessage, Severity, BrowserOptions } from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import { RVError, RVErrorType } from '../../../domain/Error';
import { StaticConfiguration } from '../../../domain/Configuration';

import { LoggerService, AutocompleteLogInfo, OfferLogInfo, FeeLogInfo } from '../../../services/LoggerService';

type SentryGeneralTags = Pick<StaticConfiguration, 'platform' | 'language'>;
type SentryGeneralTagsArgs = SentryGeneralTags & Pick<StaticConfiguration, 'environmentName'> & { sentryDSN: string };

export class SentryLogger implements LoggerService {
    private readonly tags: SentryGeneralTags;
    private readonly extras: { rateSearchKey: string };

    constructor({ sentryDSN, environmentName, ...tags }: SentryGeneralTagsArgs, params?: BrowserOptions) {
        this.tags = tags;
        this.extras = { rateSearchKey: 'Not loaded' };

        init({
            dsn: sentryDSN,
            integrations: [new Integrations.BrowserTracing()],
            tracesSampleRate: 1.0,
            environment: environmentName,
            ...params,
        });
    }

    setRateSearchKey(rateSearchKey: string): void {
        this.extras.rateSearchKey = rateSearchKey;
    }

    error({ message, type, extraInfo }: RVError): void {
        captureException(message, {
            extra: { ...this.extras, extraInfo: extraInfo || 'No extra info' },
            tags: { ...this.tags, type },
        });
    }

    private captureMessage(
        message: string,
        level: Severity,
        extras?: { [key: string]: unknown },
        tags?: { [key: string]: string },
    ): void {
        captureMessage(message, {
            extra: { ...this.extras, ...extras, level },
            tags: { ...this.tags, ...tags },
        });
    }

    log(message: string, extra: { [key: string]: unknown }): void {
        this.captureMessage(message, Severity.Log, extra);
    }

    logOfferMappingError({ rateId, providerId, error }: OfferLogInfo): void {
        this.captureMessage(
            'Could not map offer',
            Severity.Error,
            { error, rateId },
            { providerId: String(providerId), type: RVErrorType.UNEXPECTED_MAPPING_SCENARIO },
        );
    }

    logNegativePriceFee({ rateId, providerId, feeType }: FeeLogInfo): void {
        this.captureMessage(
            'The fee has a negative price',
            Severity.Info,
            { rateId },
            { providerId: String(providerId), type: RVErrorType.UNEXPECTED_MAPPING_SCENARIO, feeType },
        );
    }

    logAutocompleteError(info: AutocompleteLogInfo): void {
        this.captureMessage(
            'Could not use autocomplete suggestion',
            Severity.Info,
            { infoId: info.id },
            { type: RVErrorType.UNEXPECTED_MAPPING_SCENARIO },
        );
    }
}
