import { InsuranceType } from '../../../domain/Filter';

import { FilterMapper, reduceFilterResponse, FilterStrategy } from './Mapper';

import {
    CoverageTypeFilterResponse,
    CoverageTypeResponse,
    FilterResponse,
    RateAdditionalResponse,
    AdditionalFilterResponse,
    HCRatesApiFilterRequest,
} from '../../response/HCRatesApiResponse';

const coverageFilterInsuranceMap: [CoverageTypeResponse, InsuranceType][] = [
    [CoverageTypeResponse.UNDERBODY, 'UNDERBODY'],
    [CoverageTypeResponse.GLASS_AND_TIRE, 'GLASS_AND_TIRE'],
];
const additionalFilterInsuranceMap: [RateAdditionalResponse, InsuranceType][] = [
    [RateAdditionalResponse.RATE_WITH_TPL_MINIMUM_COVERAGE, 'RATE_WITH_TPL_MINIMUM_COVERAGE'],
    [RateAdditionalResponse.RATE_WITH_CDW_WITHOUT_LIABILITY, 'CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY'],
    [RateAdditionalResponse.RATE_WITH_THEFT_WITHOUT_LIABILITY, 'CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY'],
];

export const insuranceTypeToRequestMap: Record<InsuranceType, HCRatesApiFilterRequest> = {
    RATE_WITH_TPL_MINIMUM_COVERAGE: {
        additionals: [RateAdditionalResponse.RATE_WITH_TPL_MINIMUM_COVERAGE],
    },
    GLASS_AND_TIRE: { coverages: [CoverageTypeResponse.GLASS_AND_TIRE] },
    UNDERBODY: { coverages: [CoverageTypeResponse.UNDERBODY] },
    CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY: {
        additionals: [
            RateAdditionalResponse.RATE_WITH_CDW_WITHOUT_LIABILITY,
            RateAdditionalResponse.RATE_WITH_THEFT_WITHOUT_LIABILITY,
        ],
    },
};

const toInsuranceTypeMapper = <T extends CoverageTypeResponse | RateAdditionalResponse>(
    configPairs: [T, InsuranceType][],
): Map<T, Set<InsuranceType>> =>
    configPairs.reduce<Map<T, Set<InsuranceType>>>((toInsuranceTypeMap, [coverageType, insuranceType]) => {
        toInsuranceTypeMap.set(coverageType, (toInsuranceTypeMap.get(coverageType) || new Set()).add(insuranceType));
        return toInsuranceTypeMap;
    }, new Map());

type CarInsuranceFilterResponse = FilterResponse & { insuranceType: InsuranceType };

export const mergeCoverageTypes = (
    response: (CoverageTypeFilterResponse | AdditionalFilterResponse)[],
): CarInsuranceFilterResponse[] => {
    const merged = response.reduce<Map<InsuranceType, FilterResponse>>((reduced, response) => {
        const matches =
            'coverage' in response
                ? toInsuranceTypeMapper(coverageFilterInsuranceMap).get(response.coverage)
                : toInsuranceTypeMapper(additionalFilterInsuranceMap).get(response.additional);
        if (matches) {
            matches.forEach(insuranceType => {
                const previous = reduced.get(insuranceType);
                reduced.set(insuranceType, previous ? reduceFilterResponse(response, previous) : response);
            });
        }

        return reduced;
    }, new Map());

    return Array.from(merged).map(([insuranceType, filterResponse]) => ({
        ...filterResponse,
        insuranceType,
    }));
};

export const insurancesMapper: FilterMapper<
    CarInsuranceFilterResponse,
    Partial<HCRatesApiFilterRequest>,
    InsuranceType,
    'insurances'
> = {
    filterName: 'insurances',
    mapFilterOptionToRequest: option => insuranceTypeToRequestMap[option.id as InsuranceType],
    mapResponseToValue: response => response.insuranceType,
    mapResponseToId: response => response.insuranceType,
    type: FilterStrategy.AND,
};
