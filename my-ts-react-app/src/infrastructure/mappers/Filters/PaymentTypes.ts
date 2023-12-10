import { PaymentMethod } from '../../../domain/Filter';

import { PaymentTypeResponse, PaymentTypeFilterResponse } from '../../response/HCRatesApiResponse';

import { FilterMapper, FilterStrategy } from './Mapper';

const filterPaymentMethodsMap = new Map<PaymentTypeResponse, PaymentMethod>([
    [PaymentTypeResponse.PAYMENT_TYPE_AMEX, 'AMEX'],
    [PaymentTypeResponse.PAYMENT_TYPE_VISA, 'VISA'],
    [PaymentTypeResponse.PAYMENT_TYPE_MASTERCARD, 'MASTERCARD'],
]);

export const paymentTypesMapper: FilterMapper<PaymentTypeFilterResponse, number, PaymentMethod, 'paymentMethods'> = {
    filterName: 'paymentMethods',
    mapFilterOptionToRequest: option => Number(option.id),
    mapResponseToValue: response => filterPaymentMethodsMap.get(response.paymenttype) || null,
    mapResponseToId: response => String(response.paymenttype),
    type: FilterStrategy.OR,
};
