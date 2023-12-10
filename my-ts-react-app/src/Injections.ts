import uniqueid from 'uniqid';

import { PersistedBannerConfig } from './domain/AdBanner';
import { StaticConfiguration } from './domain/Configuration';

import {
    Backend,
    NameTranslationService,
    AutoComplete,
    AnalyticsService,
    LoggerService,
    TrackingService,
    Services,
} from './services';

import {
    UrlParametersSerializerImpl,
    HCBackend,
    HCAutocomplete,
    GoogleAnalytics,
    HotJarAnalytics,
    StoragePersistence,
    SentryLogger,
    LoggerServiceImpl,
    BrowserHistoryService,
} from './infrastructure';
import { getConfiguration } from './infrastructure/services/HCStaticConfigurationService';

import { MockedBackend } from '../test/services/MockedBackend';
import { MockedAnalytics } from '../test/services/MockedAnalytics';
import { MockedTracking } from '../test/services/MockedTracking';

type Injections = Pick<
    Services,
    | 'translationService'
    | 'backend'
    | 'autocomplete'
    | 'urlSerializer'
    | 'analyticsService'
    | 'trackingService'
    | 'loggerService'
    | 'bannersPersistence'
    | 'configuration'
    | 'isDebugging'
    | 'browserHistoryService'
>;

const resolveAnalyticsService = ({ GATrackingID, environment }: StaticConfiguration): AnalyticsService =>
    environment === 'test' ? new MockedAnalytics() : new GoogleAnalytics(GATrackingID);

const resolveTrackingService = ({ HJTrackingID, environment }: StaticConfiguration): TrackingService =>
    environment === 'test' ? new MockedTracking() : new HotJarAnalytics(HJTrackingID);

const resolveBackend = (
    { environment, ratesApiBaseUrl, platform, ratesApiKey, translatedAirportName }: StaticConfiguration,
    loggerService: LoggerService,
): Backend =>
    environment === 'test'
        ? new MockedBackend(platform)
        : new HCBackend({ ratesApiBaseUrl, platform, ratesApiKey, translatedAirportName }, loggerService);

const resolveAutocomplete = (
    { language, platform, autoCompleteBaseUrl: baseUrl, translatedAirportName }: StaticConfiguration,
    loggerService: LoggerService,
): AutoComplete & NameTranslationService =>
    new HCAutocomplete({
        baseUrl,
        language,
        platform,
        identifier: uniqueid(),
        translatedAirportName,
        loggerService,
    });

const resolveInjections = (): Injections => {
    const configuration = getConfiguration();
    const { publicPath, bannerStorageLimit, language, platform, sentryDSN, environmentName } = configuration;

    const analyticsService = resolveAnalyticsService(configuration);
    const trackingService = resolveTrackingService(configuration);

    const bannersPersistence = new StoragePersistence<PersistedBannerConfig, 'rateSearchKey', string>(
        'bannersClosed',
        'rateSearchKey',
        bannerStorageLimit,
        window.sessionStorage,
    );
    const urlSerializer = new UrlParametersSerializerImpl(publicPath);
    const browserHistoryService = new BrowserHistoryService();
    const loggerService = sentryDSN
        ? new SentryLogger({ sentryDSN, language, platform, environmentName })
        : new LoggerServiceImpl(language);
    const backend = resolveBackend(configuration, loggerService);
    const autocomplete = resolveAutocomplete(configuration, loggerService);

    const isDebugging = new URLSearchParams(location.search).get('debug') === 'true';

    return {
        translationService: autocomplete,
        backend,
        autocomplete,
        urlSerializer,
        analyticsService,
        trackingService,
        loggerService,
        bannersPersistence,
        configuration,
        isDebugging,
        browserHistoryService,
    };
};

export default resolveInjections;
