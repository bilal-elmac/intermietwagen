import { Price, PaymentMoment } from '../../domain/Price';

import { PriceResponse, TimeOfPaymentResponse } from '../response/HCRatesApiResponse';

const paymentMomentMap = new Map<TimeOfPaymentResponse, PaymentMoment>([
    [TimeOfPaymentResponse.AT_DESK, PaymentMoment.PAY_AT_DESK],
    [TimeOfPaymentResponse.MULTIPLE, PaymentMoment.MIXED],
    [TimeOfPaymentResponse.PREPAID, PaymentMoment.PAY_ONLINE],
]);

export const createPrice = (price: Partial<Price> & Pick<Price, 'currencyCode'>): Price => ({
    value: 0,
    taxPercentage: null,
    payAt: null,
    ...price,
});

export const mapPriceResponse = ({ currency, net, gross, timeofpayment }: PriceResponse): Price => ({
    currencyCode: currency,
    value: gross,
    taxPercentage: (gross - net) / gross || null,
    payAt: paymentMomentMap.get(timeofpayment) || null,
});

/**
 * Yields the lowest valid (non-zero) price
 */
export const mapLowestPrice = (...numbers: (null | undefined | number)[]): number => {
    const lowest = Math.min(...numbers.map(n => n || Infinity));
    return isFinite(lowest) ? lowest : 0;
};
