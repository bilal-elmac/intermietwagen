import { Insurance, CarInsurance } from '../../../domain/Insurance';
import { Price } from '../../../domain/Price';

import { InsuranceResponse, CoverageTypeResponse } from '../../response/HCRatesApiResponse';
import { createPrice, mapPriceResponse } from '../Price';

const carInsuranceCoverageTypeMap: Record<CoverageTypeResponse, CarInsurance['insuranceType'][]> = {
    [CoverageTypeResponse.CDW]: ['CDW'],
    [CoverageTypeResponse.THEFT]: ['THEFT'],
    [CoverageTypeResponse.UNDERBODY]: ['UNDERBODY'],
    [CoverageTypeResponse.GLASS_AND_TIRE]: ['GLASS', 'TIRES'],
    [CoverageTypeResponse.ROOF]: ['ROOF'],
    [CoverageTypeResponse.CDW_THEFT_THIRD_PARTY]: ['CDW', 'THEFT'],
    [CoverageTypeResponse.CDW_THIRD_PARTY]: ['CDW'],
    [CoverageTypeResponse.THEFT_THIRD_PARTY]: ['THEFT'],

    // Not used
    [CoverageTypeResponse.UNKNOWN_COVERAGE_TYPE]: [],
    [CoverageTypeResponse.THIRD_PARTY]: [],
    [CoverageTypeResponse.PERSONAL_INJURY]: [],
    [CoverageTypeResponse.PROPERTY_DAMAGE]: [],
    [CoverageTypeResponse.GLASS]: [],
    [CoverageTypeResponse.TIRE]: [],
    [CoverageTypeResponse.CDW_THEFT]: [],
};

export const mapInsurances = (
    { carinsurancesList, thirdpartyinsurance }: InsuranceResponse,
    currencyCode: string,
): Insurance[] => {
    const insurances = new Map<Insurance['insuranceType'], [Price | null, Price | null]>();

    carinsurancesList.forEach(({ coverage, excess, coverageprice }) => {
        const types = carInsuranceCoverageTypeMap[coverage];
        if (types.length === 0) {
            return;
        }

        const excessCoverage: Price | null = coverageprice ? mapPriceResponse(coverageprice) : null;
        // "with liability" = "with excess coverage"
        let liability: Price | null = mapPriceResponse(excess);
        switch (liability.value) {
            case 0:
                liability = { ...liability, value: Infinity };
                break;
            case -1:
                liability = null;
                break;
        }

        // If values are overwritten, they should have the same value
        types.forEach(insuranceType => insurances.set(insuranceType, [liability, excessCoverage]));
    });

    if (thirdpartyinsurance) {
        insurances.set('THIRD_PARTY', [
            createPrice({
                currencyCode,
                value: thirdpartyinsurance.limit <= 0 ? Infinity : thirdpartyinsurance.limit,
            }),
            null,
        ]);
    }

    return Array.from(insurances).map<Insurance>(([insuranceType, [liability, coveragePrice]]) => {
        if (insuranceType === 'CDW' || insuranceType === 'THEFT' || insuranceType === 'THIRD_PARTY') {
            return { insuranceType, liability, coveragePrice };
        }

        return { insuranceType };
    });
};
