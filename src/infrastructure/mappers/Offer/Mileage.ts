import { Mileage, DistanceUnit } from '../../../domain/Offer';

import {
    DistanceResponse,
    ConditionalFeeResponse,
    DistanceTypeResponse,
    ConditionalFeeTypeResponse,
} from '../../response/HCRatesApiResponse';

import { mapPriceResponse } from '../Price';
import { RVError, RVErrorType } from '../../../domain/Error';

export const mapApiMileage = (
    distanceResponse: DistanceResponse,
    fees: ConditionalFeeResponse[],
    rateId: string,
): Mileage => {
    const distanceUnit: DistanceUnit = distanceResponse.distancetype === DistanceTypeResponse.MILES ? 'miles' : 'km';

    if (distanceResponse.distance === -1) {
        // Unlimited scenario
        return { included: null, pricePerAdditional: null, distanceUnit };
    }

    // Limited scenario
    const aditionalKmFee = fees.find(f => f.conditionalfeetype === ConditionalFeeTypeResponse.ADDITIONAL_DISTANCE);

    if (!aditionalKmFee || !aditionalKmFee.price) {
        throw new RVError(
            RVErrorType.UNEXPECTED_MAPPING_SCENARIO,
            'Could not find valid aditional mileage fee for limited mileage',
            { rateId },
        );
    }

    return {
        included: distanceResponse.distance,
        pricePerAdditional: mapPriceResponse(aditionalKmFee.price),
        distanceUnit,
    };
};
