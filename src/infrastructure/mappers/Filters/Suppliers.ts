import { Highlightable } from '../../../domain/Filter';
import { Supplier } from '../../../domain/Supplier';

import { SupplierClassificationResponse, SupplierFilterResponse } from '../../response/HCRatesApiResponse';
import { mapSupplier } from '../Supplier';

import { FilterMapper, FilterStrategy } from './Mapper';

export const suppliersMapper: FilterMapper<SupplierFilterResponse, number, Supplier & Highlightable, 'suppliers'> = {
    filterName: 'suppliers',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => {
        const supplier = mapSupplier(response.supplier, null);
        return (
            supplier && {
                ...supplier,
                highlight: response.supplier.classification === SupplierClassificationResponse.PREMIUM_SUPPLIER,
            }
        );
    },
    mapResponseToId: response => String(response.supplier.supplierid),
    type: FilterStrategy.OR,
};
