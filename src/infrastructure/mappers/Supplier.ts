import { Supplier } from '../../domain/Supplier';
import { DetailedCountedRating, CountedRating, AverageRating } from '../../domain/Rating';

import { SupplierResponse, SupplierClassificationResponse } from '../response/HCRatesApiResponse';

type MapSupplierArgs = Pick<
    SupplierResponse,
    'supplierid' | 'isnameallowed' | 'islogoallowed' | 'name' | 'logourl' | 'classification'
>;

export const mapSupplier = (
    supplierResponse: MapSupplierArgs,
    ratings: (DetailedCountedRating & CountedRating & AverageRating) | null,
): Supplier | null => {
    // If the name is not allowed or the supplier is not mapped (supplierid === 0), than ignore it
    if (!supplierResponse.isnameallowed || !supplierResponse.supplierid) {
        return null;
    }

    return {
        id: supplierResponse.supplierid,
        name: String(supplierResponse.name || supplierResponse.supplierid),
        rawName: supplierResponse.name || null,
        logoUrl: (supplierResponse.islogoallowed && supplierResponse.logourl) || null,
        rating: ratings ? { average: ratings.average, count: ratings.count } : null,
        isBad: supplierResponse.classification === SupplierClassificationResponse.BAD_SUPPLIER,
    };
};
