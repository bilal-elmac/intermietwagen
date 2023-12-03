import translations from '../../../configuration/translations.json';

import { StaticConfiguration, Language, EnvironmentType } from '../../domain/Configuration';
import { Platform } from '../../domain/Platform';

export const getConfiguration = (): StaticConfiguration => {
    const configuration: StaticConfiguration = {
        leafletMapAPIKey: process.env.LEAFLET_MAP_API_KEY as string,
        GATrackingID: process.env.GA_TRACKING_ID || null,
        HJTrackingID: Number(process.env.HJ_TRACKING_ID) || null,
        sentryDSN: process.env.SENTRY_DSN || null,

        ratesApiBaseUrl: process.env.HC_RATES_API_BASE_URL as string,
        ratesApiKey: process.env.HC_RATES_API_KEY as string,

        loadMoments: process.env.LOAD_MOMENTS ? process.env.LOAD_MOMENTS.split(',').map(Number) : [],
        loadingBannerTimespan: Number(process.env.LOAD_BANNER_TIMESPAN),

        autoCompleteBaseUrl: process.env.HC_AUTOCOMPLETE_BASE_URL as string,

        title: translations['APPLICATION_TITLE_SHORT'],
        publicPath: process.env.PUBLIC_PATH_PREFFIX ? `/${process.env.PUBLIC_PATH_PREFFIX}/` : '/',
        host: process.env.HOST || '0.0.0.0',

        dateFormat: process.env.DATE_FORMAT as string,
        is12HourFormat: process.env.IS_12HOUR_FORMAT === 'true',
        environment: process.env.NODE_ENV as EnvironmentType,
        environmentName: process.env.ENV_NAME as string,
        language: process.env.LANGUAGE as Language,
        platform: process.env.PLATFORM as Platform,
        bannerStorageLimit: Number(process.env.BANNER_STORAGE_LIMIT),
        translations,
        translatedAirportName: translations['AIRPORT_NAME'],

        faqLink: process.env.FAQ_LINK || null,
        hasHotline: process.env.HAS_FAQ_HOTLINE === 'true',
        hasFAQWebsite: process.env.HAS_FAQ_WEBSITE === 'true',

        displayCovidBanner: process.env.DISPLAY_COVID_BANNER === 'true',
    };

    const values = Object.values<unknown>(configuration as {});
    if (values.includes(undefined) || values.includes(NaN)) {
        console.warn('One or more configuration seems not to be properly setup', configuration);
    }

    return configuration;
};
