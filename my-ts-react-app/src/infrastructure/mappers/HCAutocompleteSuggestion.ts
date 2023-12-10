import {
    AutocompleteSuggestionResponse,
    mapSuggestionsToPlaces,
    PlaceType,
} from '@happycargmbh/hc-autocomplete-package';

import { AutocompleteSuggestion } from '../../domain/Autocomplete';

import { Indexed } from '../../utils/TypeUtils';

import { LoggerService } from '../../services/LoggerService';

const typesMap: Record<PlaceType, AutocompleteSuggestion['type']> = {
    [PlaceType.AIRPORT]: 'airport',
    [PlaceType.CITY]: 'city',
    [PlaceType.RAILWAY]: 'railway',
    [PlaceType.OTHER]: 'other',
};

export const mapSuggestions = (
    response: AutocompleteSuggestionResponse[],
    {
        loggerService,
        translatedAirportName,
    }: {
        loggerService: LoggerService;
        translatedAirportName: string;
    },
): AutocompleteSuggestion[] => {
    const indexed = response.reduce<Indexed<AutocompleteSuggestionResponse>>(
        (indexed, suggestion) => ({ ...indexed, [suggestion.id]: suggestion }),
        {},
    );

    const places = mapSuggestionsToPlaces(response, { localizedAirportName: translatedAirportName });

    return places.reduce<AutocompleteSuggestion[]>((reduced, { id, name, type, summary, iata, additionalInfo }) => {
        const rawSuggestion = indexed[id];

        const { lat, lng } = rawSuggestion;

        if (lat === null || lng === null) {
            loggerService.logAutocompleteError({ id, lat, lng });
            return reduced;
        }

        const suggestion: AutocompleteSuggestion = {
            name,
            type: typesMap[type],
            summary,
            iata,
            additionalInfo,
            lat,
            lng,

            rawAutoCompleteData: JSON.stringify(rawSuggestion),
        };

        return [...reduced, suggestion];
    }, []);
};
