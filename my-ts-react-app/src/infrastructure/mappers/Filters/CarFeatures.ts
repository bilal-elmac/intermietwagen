import { CarFeatureType } from '../../../domain/Filter';

import {
    HCRatesApiFilterRequest,
    ConditionalFeeTypeResponse,
    EquipmentTypeResponse,
    EquipmentTypeFilterResponse,
    ConditionalFeeTypeFilterResponse,
    AdditionalFilterResponse,
    RateAdditionalResponse,
} from '../../response/HCRatesApiResponse';

import { FilterMapper, FilterStrategy } from './Mapper';

const conditionalFeeCarFeatureMap = new Map<ConditionalFeeTypeResponse, CarFeatureType>([
    [ConditionalFeeTypeResponse.FULL_TO_FULL, 'FULL_TO_FULL_FUEL_POLICY'],

    [ConditionalFeeTypeResponse.ADDITIONAL_DRIVER, 'ADDITIONAL_DRIVER'],
    [ConditionalFeeTypeResponse.ALL_ADDITIONAL_DRIVER, 'ADDITIONAL_DRIVER'],
    [ConditionalFeeTypeResponse.SECOND_ADDITIONAL_DRIVER, 'ADDITIONAL_DRIVER'],
    [ConditionalFeeTypeResponse.THIRD_ADDITIONAL_DRIVER, 'ADDITIONAL_DRIVER'],
]);

const additionalFilterCarFeatureMap = new Map<RateAdditionalResponse, CarFeatureType>([
    [RateAdditionalResponse.CAR_FOUR_WHEELS_DRIVE, 'FOUR_WHEELS'],
    [RateAdditionalResponse.CAR_FUEL_DIESEL, 'DIESEL'],
    [RateAdditionalResponse.CAR_HYBRID, 'HYBRID'],
    [RateAdditionalResponse.CAR_ELECTRIC, 'ELECTRIC'],
    [RateAdditionalResponse.CAR_GEAR_AUTOMATIC, 'AUTOMATIC'],
    [RateAdditionalResponse.CAR_MODEL_GUARANTEE, 'CAR_MODEL_GUARANTEE'],
    [RateAdditionalResponse.RATE_UNLIMITED_KM, 'UNLIMITED_DISTANCE'],
]);

const equipmentsCarFeatureMap = new Map<EquipmentTypeResponse, CarFeatureType>([
    [EquipmentTypeResponse.AIR_CONDITIONING, 'AIR_CONDITIONER'],
    [EquipmentTypeResponse.WINTER_TIRES, 'WINTER_TIRES'],
]);

export const carFeatureTypeToRequestMap: Record<CarFeatureType, Partial<HCRatesApiFilterRequest>> = {
    AIR_CONDITIONER: { equipments: [EquipmentTypeResponse.AIR_CONDITIONING] },
    AUTOMATIC: { additionals: [RateAdditionalResponse.CAR_GEAR_AUTOMATIC] },
    WINTER_TIRES: { equipments: [EquipmentTypeResponse.WINTER_TIRES] },
    FOUR_WHEELS: { additionals: [RateAdditionalResponse.CAR_FOUR_WHEELS_DRIVE] },
    DIESEL: { additionals: [RateAdditionalResponse.CAR_FUEL_DIESEL] },
    HYBRID: { additionals: [RateAdditionalResponse.CAR_HYBRID] },
    ELECTRIC: { additionals: [RateAdditionalResponse.CAR_ELECTRIC] },
    FULL_TO_FULL_FUEL_POLICY: { conditionalFees: [ConditionalFeeTypeResponse.FULL_TO_FULL] },
    ADDITIONAL_DRIVER: {
        conditionalFees: [
            ConditionalFeeTypeResponse.ADDITIONAL_DRIVER,
            ConditionalFeeTypeResponse.ALL_ADDITIONAL_DRIVER,
            ConditionalFeeTypeResponse.SECOND_ADDITIONAL_DRIVER,
            ConditionalFeeTypeResponse.THIRD_ADDITIONAL_DRIVER,
        ],
    },
    UNLIMITED_DISTANCE: { additionals: [RateAdditionalResponse.RATE_UNLIMITED_KM] },
    CAR_MODEL_GUARANTEE: { additionals: [RateAdditionalResponse.CAR_MODEL_GUARANTEE] },
};

export const carFeaturesMapper: FilterMapper<
    EquipmentTypeFilterResponse | ConditionalFeeTypeFilterResponse | AdditionalFilterResponse,
    Partial<HCRatesApiFilterRequest>,
    CarFeatureType,
    'features'
> = {
    filterName: 'features',
    mapFilterOptionToRequest: option => carFeatureTypeToRequestMap[option.id as CarFeatureType],
    mapResponseToValue: response => {
        const equipment = (response as EquipmentTypeFilterResponse).equipment;
        if (equipment) {
            return equipmentsCarFeatureMap.get(equipment) || null;
        }
        const conditionalfee = (response as ConditionalFeeTypeFilterResponse).conditionalfee;
        if (conditionalfee) {
            return conditionalFeeCarFeatureMap.get(conditionalfee) || null;
        }

        const additionalFilter = (response as AdditionalFilterResponse).additional;
        if (additionalFilter) {
            return additionalFilterCarFeatureMap.get(additionalFilter) || null;
        }

        return null;
    },
    mapResponseToId: response => carFeaturesMapper.mapResponseToValue(response),
    type: FilterStrategy.AND,
};
