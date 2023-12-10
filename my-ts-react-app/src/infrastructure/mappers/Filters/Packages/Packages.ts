import { Indexed } from '../../../../utils/TypeUtils';

import { OfferPackage, CarFeatureType, InsuranceType, PackageRelatedFilters } from '../../../../domain/Filter';
import { OfferPackageFeature, PackageType } from '../../../../domain/OfferPackage';

import { FilterMapper, FilterStrategy } from '../Mapper';
import { insuranceTypeToRequestMap } from '../Insurances';
import { carFeatureTypeToRequestMap } from '../CarFeatures';

import {
    HappyPackageConfigurationResponse,
    RateAdditionalResponse,
    ConditionalFeeTypeResponse,
    CoverageTypeResponse,
    HappyPackageFilterResponse,
    HappycarPackageTypeResponse,
} from '../../../response/HCRatesApiResponse';
import { mapPackageType } from '../../Offer/Package';

interface PackageOptionConfiguration {
    readonly additionals: RateAdditionalResponse[];
    readonly conditionalFees: ConditionalFeeTypeResponse[];
    readonly coverages: CoverageTypeResponse[];
}

const packageOptionsMap: Record<OfferPackageFeature, Partial<PackageOptionConfiguration>> = {
    UNLIMITED_DISTANCE: carFeatureTypeToRequestMap['UNLIMITED_DISTANCE'],
    BEST_FUEL_OPTION: carFeatureTypeToRequestMap['FULL_TO_FULL_FUEL_POLICY'],
    GLASS_AND_TIRE_INSURANCE: insuranceTypeToRequestMap['GLASS_AND_TIRE'],
    CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY: insuranceTypeToRequestMap['CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY'],
    UNDERBODY_INSURANCE: insuranceTypeToRequestMap['UNDERBODY'],
};

const featuresToFiltersMap: Record<
    OfferPackageFeature,
    [CarFeatureType | InsuranceType, keyof PackageRelatedFilters]
> = {
    UNLIMITED_DISTANCE: ['UNLIMITED_DISTANCE', 'features'],
    BEST_FUEL_OPTION: ['FULL_TO_FULL_FUEL_POLICY', 'features'],
    UNDERBODY_INSURANCE: ['UNDERBODY', 'insurances'],
    CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY: ['CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY', 'insurances'],
    GLASS_AND_TIRE_INSURANCE: ['GLASS_AND_TIRE', 'insurances'],
};

const index = <R>(response: R[], generateKey: (r: R) => string | number): Indexed<R> =>
    response.reduce<Indexed<R>>((indexed, response) => ({ ...indexed, [String(generateKey(response))]: response }), {});

type OfferPackageResponse = HappyPackageFilterResponse & {
    features: OfferPackageFeature[];
    relatedFilters: OfferPackage['relatedFilters'];
};

const createDefaultOption = (
    happycarpackage: HappycarPackageTypeResponse,
    defaultImageUrl: string,
): HappyPackageFilterResponse => ({
    selected: false,
    minprice: 0,
    image: defaultImageUrl,
    happycarpackage,
});

export const mergePackages = (
    happycarpackagesList: HappyPackageFilterResponse[],
    packagesConfiguration: HappyPackageConfigurationResponse[],
    defaultImageUrl: string,
): OfferPackageResponse[] => {
    if (happycarpackagesList.length === 0) {
        return [];
    }

    // These indexes have the proper prices
    const packagePrices = index(happycarpackagesList, p => p.happycarpackage);

    return packagesConfiguration.reduce<OfferPackageResponse[]>(
        (reduced, { happycarpackage, additionalsList, conditionalfeesList, coveragesList }) => {
            const packageFilterOption =
                packagePrices[happycarpackage] || createDefaultOption(happycarpackage, defaultImageUrl);

            const packageType = mapPackageType(happycarpackage);
            if (!packageType) {
                // Sub-basic type
                return reduced;
            }

            // These indexes know if this particular package has these options assigned to them
            const sAdditionals = additionalsList.reduce((i, a) => i.add(a.additional), new Set<number>());
            const sConditionals = conditionalfeesList.reduce((i, c) => i.add(c.conditionalfee), new Set<number>());
            const sCoverages = coveragesList.reduce((i, c) => i.add(c.coverage), new Set<number>());

            const relatedFilters: PackageRelatedFilters = { features: [], insurances: [] };

            const features = Object.entries(packageOptionsMap).reduce<OfferPackageFeature[]>(
                (reduced, [featureName, { conditionalFees, additionals, coverages }]) => {
                    const isPresent =
                        (!additionals || additionals.every(a => sAdditionals.has(a))) &&
                        (!conditionalFees || conditionalFees.every(c => sConditionals.has(c))) &&
                        (!coverages || coverages.every(c => sCoverages.has(c)));

                    if (isPresent) {
                        reduced.push(featureName as OfferPackageFeature);
                        const related = featuresToFiltersMap[featureName as OfferPackageFeature];
                        if (related) {
                            const [filterOption, filterName] = related;
                            relatedFilters[filterName].push(filterOption);
                        }
                    }

                    return reduced;
                },
                [],
            );

            return [...reduced, { ...packageFilterOption, features, relatedFilters }];
        },
        [],
    );
};

const packagesToRequestMap: Record<PackageType, HappycarPackageTypeResponse> = {
    [PackageType.BASIC]: HappycarPackageTypeResponse.BASIC,
    [PackageType.GOOD]: HappycarPackageTypeResponse.GOOD,
    [PackageType.EXCELLENT]: HappycarPackageTypeResponse.EXCELLENT,
};

export const packagesMapper: FilterMapper<
    OfferPackageResponse,
    HappycarPackageTypeResponse,
    OfferPackage,
    'packages'
> = {
    filterName: 'packages',
    mapFilterOptionToRequest: option => packagesToRequestMap[option.value.type],
    mapResponseToValue: ({ image, happycarpackage, features, relatedFilters }) => {
        const type = mapPackageType(happycarpackage);
        return !type ? null : { type, imageUrl: image, features, relatedFilters };
    },
    mapResponseToId: response => String(response.happycarpackage),
    type: FilterStrategy.OR,
};
