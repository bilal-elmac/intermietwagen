import { PackageType } from '../../../domain/OfferPackage';

import { HappycarPackageTypeResponse } from '../../response/HCRatesApiResponse';

const hcPackageType: Record<HappycarPackageTypeResponse, PackageType | null> = {
    [HappycarPackageTypeResponse.UNKNOWN_PACKAGE_TYPE]: null,
    [HappycarPackageTypeResponse.BASIC]: PackageType.BASIC,
    [HappycarPackageTypeResponse.GOOD]: PackageType.GOOD,
    [HappycarPackageTypeResponse.EXCELLENT]: PackageType.EXCELLENT,
};

export const mapPackageType = (response: HappycarPackageTypeResponse): PackageType | null => hcPackageType[response];
