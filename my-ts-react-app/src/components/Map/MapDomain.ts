import { latLng, latLngBounds, LatLngBounds, LatLng } from 'leaflet';

import { Station, StationInteractionType } from '../../domain/Station';
import { Price } from '../../domain/Price';
import { FilterOption } from '../../domain/Filter';
import { isLoaded } from '../../domain/LoadingStatus';

import { useReduxState } from '../../reducers/Actions';

export type AvailableStation = Station & { readonly minPrice: Price; readonly option: FilterOption<Station> };
export type MapStations = {
    readonly available: AvailableStation[];
    availableBounds: LatLngBounds | null;
    allBounds: LatLngBounds | null;
    readonly isOneWay: boolean | null;
    readonly loaded: boolean;
};

const doesStationHavePrice = (option: FilterOption<Station>): option is FilterOption<Station> & { prices: [Price] } =>
    Boolean(option.prices[0]);

export const isStationAvailable = (
    option: FilterOption<Station>,
): option is FilterOption<Station> & { prices: [Price] } => Boolean(!option.disabled && doesStationHavePrice(option));

export const extend = (currentBounds: LatLngBounds | null, extension: LatLng): LatLngBounds =>
    currentBounds ? currentBounds.extend(extension) : latLngBounds(extension, extension);

export const selectStations = (type: StationInteractionType): MapStations =>
    useReduxState(({ filters, search, loading }) => {
        const options: FilterOption<Station>[] = type === 'pickUp' ? filters.pickUpStations : filters.dropOffStations;
        const suggestion = search ? (type === 'pickUp' ? search.pickUp.suggestion : search.dropOff.suggestion) : null;
        const suggestionCoords = suggestion && latLng(suggestion.lat, suggestion.lng);

        return options.reduce<MapStations>(
            (stations, option) => {
                if (doesStationHavePrice(option)) {
                    const station: AvailableStation = {
                        minPrice: option.prices[0],
                        option,
                        id: option.id,
                        type: option.value.type,
                        ids: option.value.ids,
                        interactionType: option.value.interactionType,
                        locationName: option.value.locationName,
                        lat: option.value.lat,
                        lng: option.value.lng,
                        iata: option.value.iata,
                    };

                    const coordinates = latLng(station.lat, station.lng);
                    stations.allBounds = extend(stations.allBounds, coordinates);

                    if (isStationAvailable(option)) {
                        stations.available.push(station);
                        stations.availableBounds = extend(stations.allBounds, coordinates);
                    }
                }

                return stations;
            },
            {
                loaded: isLoaded(loading),
                available: [],
                allBounds: suggestionCoords && extend(null, suggestionCoords),
                availableBounds: suggestionCoords && extend(null, suggestionCoords),
                isOneWay: search && search.isOneWay,
            },
        );
    });

export const hasActiveStations = (): Record<StationInteractionType, boolean> =>
    useReduxState(s => ({
        pickUp: s.filters.pickUpStations.some(isStationAvailable),
        dropOff: s.filters.dropOffStations.some(isStationAvailable),
    }));

export const countSelectedStations = (): Record<StationInteractionType, number> =>
    useReduxState(s => ({
        pickUp: s.filters.pickUpStations.filter(station => station.selected).length,
        dropOff: s.filters.dropOffStations.filter(station => station.selected).length,
    }));

export const hasSelectedStations = (): Record<StationInteractionType, boolean> =>
    useReduxState(s => ({
        pickUp: s.filters.pickUpStations.filter(station => station.selected).length > 0,
        dropOff: s.filters.dropOffStations.filter(station => station.selected).length > 0,
    }));
