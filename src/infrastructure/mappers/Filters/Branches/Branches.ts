import { getCenter } from 'geolib';
import geohash from 'latlon-geohash';

import { Indexed } from '../../../../utils/TypeUtils';

import { Station, StationInteractionType } from '../../../../domain/Station';
import { Coords } from '../../../../domain/Location';

import { MapBranchResponse, BranchTypeResponse, FilterResponse } from '../../../response/HCRatesApiResponse';
import { mapBranchType } from '../../Branch';
import { FilterMapper, FilterStrategy } from '../Mapper';
import { mapIata } from '../../Iata';

type GroupedBranchResponse = {
    readonly coordinates: Coords;
    readonly stationName: string;
    readonly stationType: BranchTypeResponse;
    readonly iata: string | null;
};

type NeighbourStations = {
    readonly id: string;
    readonly stationName: string;
    readonly stationType: BranchTypeResponse;
    readonly ids: string[];
    readonly coordinates: Coords[];
    readonly iata: string | null;
    readonly minPrice: number;
};

type PricedStation<I extends StationInteractionType> = Station<I> & Pick<FilterResponse, 'minprice' | 'selected'>;
type NonSelectedPricedStation<I extends StationInteractionType> = Omit<PricedStation<I>, 'selected'>;

// This groups everything under a 500m radius
const HASH_PRECISION = 6;
const createBranchHashkey = ({
    stationName,
    coordinates: { lat, lng },
    stationType,
    iata,
}: GroupedBranchResponse): string => {
    const out = [];

    if (stationName) {
        out.push(stationName);
    }

    out.push(geohash.encode(lat, lng, HASH_PRECISION));
    out.push(stationType);

    if (iata) {
        out.push(iata);
    }

    return out.join('-');
};

const mapNearbyStationResponses = <I extends StationInteractionType>(
    branches: MapBranchResponse[],
    interactionType: I,
): NonSelectedPricedStation<I>[] => {
    const indexedBranches = branches.reduce<Indexed<NeighbourStations>>(
        (
            neighborhoods,
            { branchId, stationName, stationType, iata: rawIata, coordinates: { latitude, longitude }, minprice },
        ) => {
            if (!stationName) {
                return neighborhoods;
            }

            const iata = mapIata(rawIata);

            const coordinates = { lat: latitude, lng: longitude };
            const neighborhoodId = createBranchHashkey({ stationName, stationType, coordinates, iata });
            const neighborhood: NeighbourStations = neighborhoods[neighborhoodId] || {
                id: neighborhoodId,
                iata,
                stationName,
                stationType,
                ids: [],
                coordinates: [],
                minPrice: Infinity,
            };

            return {
                ...neighborhoods,
                [neighborhoodId]: {
                    ...neighborhood,
                    ids: [...neighborhood.ids, branchId],
                    coordinates: [...neighborhood.coordinates, coordinates],
                    minPrice: Math.min(minprice || Infinity, neighborhood.minPrice),
                },
            };
        },
        {},
    );

    const stations = Object.values(indexedBranches).map<NonSelectedPricedStation<I>>(neighborhood => {
        const { stationName, stationType, id, ids, coordinates, minPrice, iata } = neighborhood;
        const { latitude, longitude } =
            coordinates.length === 1
                ? { latitude: coordinates[0].lat, longitude: coordinates[0].lng }
                : (getCenter(coordinates) as { latitude: number; longitude: number });

        return {
            id,
            ids,
            type: mapBranchType(stationType),
            locationName: stationName,
            lat: latitude,
            lng: longitude,
            interactionType,
            iata,
            minprice: isFinite(minPrice) ? minPrice : 0,
        };
    });

    return stations;
};

export const mergeMapBranchesFilterOptions = <I extends StationInteractionType>(
    branches: MapBranchResponse[],
    selectedIds: string[],
    interactionType: I,
): PricedStation<I>[] => {
    const selected = new Set(selectedIds);

    return mapNearbyStationResponses(branches, interactionType).map<PricedStation<I>>(
        ({ id, ids, iata, type, interactionType, locationName, lat, lng, minprice }) => ({
            id,
            ids,
            selected: ids.every(id => selected.has(id)),
            minprice,
            iata,
            type,
            interactionType,
            locationName,
            lat,
            lng,
        }),
    );
};

/**
 * This is here to make sure we are not passing down unknown props
 */
const mapResponseToValue = <T extends StationInteractionType>({
    id,
    ids,
    iata,
    type,
    interactionType,
    locationName,
    lat,
    lng,
}: PricedStation<T>): Station<T> | null => ({
    id,
    ids,
    iata,
    type,
    interactionType,
    locationName,
    lat,
    lng,
});

export const pickUpStationsMapper: FilterMapper<
    PricedStation<'pickUp'>,
    string[],
    Station<'pickUp'>,
    'pickUpStations'
> = {
    filterName: 'pickUpStations',
    mapFilterOptionToRequest: option => option.value.ids,
    mapResponseToValue,
    mapResponseToId: response => response.id,
    type: FilterStrategy.OR,
};

export const dropOffStationsMapper: FilterMapper<
    PricedStation<'dropOff'>,
    string[],
    Station<'dropOff'>,
    'dropOffStations'
> = {
    filterName: 'dropOffStations',
    mapFilterOptionToRequest: option => option.value.ids,
    mapResponseToValue,
    mapResponseToId: response => response.id,
    type: FilterStrategy.OR,
};
