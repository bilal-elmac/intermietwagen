import { OfferPackageFeature } from '../../domain/OfferPackage';

const PACKAGE_FEATURES_ORDER: OfferPackageFeature[] = [
    OfferPackageFeature.BEST_FUEL_OPTION,
    OfferPackageFeature.UNLIMITED_DISTANCE,
    OfferPackageFeature.CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY,
    OfferPackageFeature.GLASS_AND_TIRE_INSURANCE,
    OfferPackageFeature.UNDERBODY_INSURANCE,
];

export const sortPackageFeatures = ([...features]: OfferPackageFeature[]): OfferPackageFeature[] =>
    features.sort((a, b) => PACKAGE_FEATURES_ORDER.indexOf(a) - PACKAGE_FEATURES_ORDER.indexOf(b));
