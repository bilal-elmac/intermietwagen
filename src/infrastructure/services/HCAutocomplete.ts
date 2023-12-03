import {
    AutoCompleteClient,
    Language as AutoCompleteLanguage,
    Platform as AutoCompletePlatform,
    mapTranslatedName,
} from '@happycargmbh/hc-autocomplete-package';

import { AutocompleteSuggestion } from '../../domain/Autocomplete';
import { Platform } from '../../domain/Platform';
import { wrapAsyncError, RVErrorType } from '../../domain/Error';
import { Language } from '../../domain/Configuration';

import { AutoComplete } from '../../services/AutoComplete';
import { NameTranslationService } from '../../services/NameTranslation';
import { LoggerService } from '../../services/LoggerService';

import { mapSuggestions } from '../mappers/HCAutocompleteSuggestion';

import { Cached } from './Cache';

interface Config {
    readonly baseUrl: string;
    readonly language: Language;
    readonly platform: Platform;
    readonly identifier: string;
    readonly loggerService: LoggerService;
    readonly translatedAirportName: string;
}

const supportedLanguagesMap: Record<Language, AutoCompleteLanguage> = {
    nl: AutoCompleteLanguage.NL,
    en: AutoCompleteLanguage.EN,
    fr: AutoCompleteLanguage.FR,
    de: AutoCompleteLanguage.DE,
    ['de-ch']: AutoCompleteLanguage.DE,
    it: AutoCompleteLanguage.IT,
    pl: AutoCompleteLanguage.PL,
    es: AutoCompleteLanguage.ES,
};

const supportedPlatforms: Record<Platform, AutoCompletePlatform> = {
    NL: AutoCompletePlatform.NL,
    US: AutoCompletePlatform.US,
    FR: AutoCompletePlatform.FR,
    DE: AutoCompletePlatform.DE,
    CH: AutoCompletePlatform.CH,
    IT: AutoCompletePlatform.IT,
    PL: AutoCompletePlatform.PL,
    ES: AutoCompletePlatform.ES,
};

export class HCAutocomplete implements AutoComplete, NameTranslationService {
    private client: AutoCompleteClient;

    private airportsCache: Cached<string | null>;
    private suggestionsCache: Cached<AutocompleteSuggestion[]>;

    private config: Pick<Config, 'loggerService' | 'translatedAirportName'>;

    constructor({ platform, language, baseUrl, identifier, ...config }: Config) {
        this.client = new AutoCompleteClient({
            baseURL: baseUrl,
            identifier: identifier,
            language: supportedLanguagesMap[language],
            platform: supportedPlatforms[platform],
        });

        this.config = config;

        this.airportsCache = new Cached<string | null>();
        this.suggestionsCache = new Cached<AutocompleteSuggestion[]>();
    }

    async fetchAirportName(iata: string): Promise<string | null> {
        return this.airportsCache.fetchOnce(iata, async () => {
            try {
                const airportInfo = await this.client.fetchAirport(iata);
                return mapTranslatedName(airportInfo);
            } catch {
                // Errors are just ignored, and expect, for airports not cataloged in our DB
                return null;
            }
        });
    }

    async fetchSuggestions(searchTerm: string): Promise<AutocompleteSuggestion[]> {
        return this.suggestionsCache.fetchOnce(searchTerm, async () => {
            const suggestions = await wrapAsyncError(
                () => this.client.fetchSuggestions(searchTerm),
                RVErrorType.UNEXPECTED_AUTOCOMPLETE_DATA_LOAD,
            );

            return mapSuggestions(suggestions, this.config);
        });
    }
}
