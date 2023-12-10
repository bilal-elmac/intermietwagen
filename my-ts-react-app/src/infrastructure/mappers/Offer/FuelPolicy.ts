import { FuelPolicy } from '../../../domain/Offer';

import { ConditionalFeeTypeResponse, ConditionalFeeResponse } from '../../response/HCRatesApiResponse';

const fuelPolicyMap = new Map<ConditionalFeeTypeResponse, FuelPolicy>([
    [ConditionalFeeTypeResponse.FULL_TO_EMPTY, 'f2e'],
    [ConditionalFeeTypeResponse.FULL_TO_FULL, 'f2f'],
    [ConditionalFeeTypeResponse.QUARTER_TO_EMPTY, 'q2e'],
    [ConditionalFeeTypeResponse.EMPTY_TO_EMPTY, 'e2e'],
    [ConditionalFeeTypeResponse.HALF_TO_HALF, 'h2h'],
]);

export const mapFuelPolicy = (fees: ConditionalFeeResponse[]): FuelPolicy => {
    const matchingFeeType = fees.find(f => f.included && fuelPolicyMap.has(f.conditionalfeetype)) || null;
    const fee = (matchingFeeType && fuelPolicyMap.get(matchingFeeType.conditionalfeetype)) || null;
    return fee || 'UNKNOWN';
};
