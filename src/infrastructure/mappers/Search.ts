import { SearchParameters, Suggestion } from '../../domain/SearchParameters';
import { Place } from '../../domain/Location';
import { RVError, RVErrorType } from '../../domain/Error';

import { SearchResponse, LocationResponse } from '../response/HCRatesApiResponse';

import { mapAge } from './DynamicConfiguration';
import { mapSuggestions } from './HCAutocompleteSuggestion';

import { isDateValid, parseTimezonelessDate } from '../../utils/TimeUtils';
import { LoggerService } from '../../services/LoggerService';

const mapCoords = (response: LocationResponse | null): { lat: number; lng: number } => {
    if (
        !response ||
        response.latitude === null ||
        response.latitude === undefined ||
        response.longitude === null ||
        response.longitude === undefined
    ) {
        throw new RVError(RVErrorType.UNEXPECTED_MAPPING_SCENARIO, 'Unexpected search location response', {
            ...response,
        });
    }

    return { lat: response.latitude, lng: response.longitude };
};

export const mapApiSearchResponse = (
    { pickUpDate, pickUpLocation, dropOffDate, dropOffLocation, driverAge }: SearchResponse,
    rentalAges: { [key: number]: string },
    suggestionMapperConfig: { translatedAirportName: string; loggerService: LoggerService },
): SearchParameters => {
    const pickupTime = (pickUpDate && parseTimezonelessDate(pickUpDate)) || null;
    const dropOffTime = (dropOffDate && parseTimezonelessDate(dropOffDate)) || null;

    const age = driverAge && rentalAges[Number(driverAge)] && mapAge(String(driverAge), rentalAges[Number(driverAge)]);

    const pickUpLocationName = (pickUpLocation && pickUpLocation.name) || null;
    const dropOffLocationName = (dropOffLocation && dropOffLocation.name) || null;

    const droppOffSuggestion =
        dropOffLocation &&
        dropOffLocation.autocompleteData &&
        mapSuggestions([dropOffLocation.autocompleteData], suggestionMapperConfig)[0];
    const pickUpSuggestion =
        pickUpLocation &&
        pickUpLocation.autocompleteData &&
        mapSuggestions([pickUpLocation.autocompleteData], suggestionMapperConfig)[0];

    if (
        !isDateValid(pickupTime) ||
        !isDateValid(dropOffTime) ||
        !age ||
        !pickUpLocationName ||
        !dropOffLocationName ||
        !droppOffSuggestion ||
        !pickUpSuggestion
    ) {
        throw new RVError(RVErrorType.UNEXPECTED_MAPPING_SCENARIO, 'Unexpected search parameters', {
            pickUpDate,
            pickUpLocation,
            dropOffDate,
            dropOffLocation,
            driverAge,
        });
    }

    const pickUpCoords = mapCoords(pickUpLocation);
    const dropOffCoords = mapCoords(dropOffLocation);

    return {
        pickUp: {
            locationName: pickUpLocationName,
            time: pickupTime,
            suggestion: pickUpSuggestion,
        },
        dropOff: {
            locationName: dropOffLocationName,
            time: dropOffTime,
            suggestion: droppOffSuggestion,
        },
        age,
        isOneWay: pickUpCoords.lat !== dropOffCoords.lat || pickUpCoords.lng !== dropOffCoords.lng,
    };
};

export const mapLocation = (pickupDropOff: Place & Suggestion): LocationResponse => ({
    name: pickupDropOff.suggestion.name,
    iata: pickupDropOff.suggestion.iata || undefined,
    latitude: pickupDropOff.suggestion.lat,
    longitude: pickupDropOff.suggestion.lng,
    autocompleteData: JSON.parse(pickupDropOff.suggestion.rawAutoCompleteData),
});
