import { Extra } from '../../../domain/Offer';

import {
    ConditionalFeeResponse,
    EquipmentResponse,
    ConditionalFeeTypeResponse,
    EquipmentTypeResponse,
} from '../../response/HCRatesApiResponse';

const feesToExtrasMap = new Map<ConditionalFeeTypeResponse, Extra>([
    [ConditionalFeeTypeResponse.ADDITIONAL_DRIVER, 'additional_driver'],
    [ConditionalFeeTypeResponse.ALL_ADDITIONAL_DRIVER, 'additional_driver'],
    [ConditionalFeeTypeResponse.SECOND_ADDITIONAL_DRIVER, 'additional_driver'],
    [ConditionalFeeTypeResponse.THIRD_ADDITIONAL_DRIVER, 'additional_driver'],
    [ConditionalFeeTypeResponse.BORDER_CROSSING_FEE, 'cross_border'],
    [ConditionalFeeTypeResponse.VEHICLE_DELIVERY, 'vehicle_delivery'],
    [ConditionalFeeTypeResponse.VEHICLE_COLLECTION, 'vehicle_delivery'],
]);

const equipmentToExtrasMap = new Map<EquipmentTypeResponse, Extra>([
    [EquipmentTypeResponse.BABY_SEAT, 'baby_seat'],
    [EquipmentTypeResponse.CHILD_SEAT, 'child_seat'],
    [EquipmentTypeResponse.BOOSTER_SEAT, 'booster_seat'],
    [EquipmentTypeResponse.SNOW_CHAINS, 'snow_chains'],
    [EquipmentTypeResponse.SKI_RACK, 'ski_racks'],
    [EquipmentTypeResponse.WINTER_TIRES, 'winter_tires'],
    [EquipmentTypeResponse.GPS, 'gps'],
]);

export const mapExtras = (fees: ConditionalFeeResponse[], equipments: EquipmentResponse[]): Extra[] => {
    const extras = new Set<Extra>();

    fees.forEach(fee => {
        if (!fee.included) {
            const extra = feesToExtrasMap.get(fee.conditionalfeetype);
            if (extra) {
                extras.add(extra);
            }
        }
    });

    equipments.forEach(equipment => {
        if (!equipment.included) {
            const extra = equipmentToExtrasMap.get(equipment.type);
            if (extra) {
                extras.add(extra);
            }
        }
    });

    return Array.from(extras).sort();
};
