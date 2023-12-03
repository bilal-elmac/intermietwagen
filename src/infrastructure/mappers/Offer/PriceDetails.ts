import { Fee, PriceDetails, FeeType, PaymentMethod } from '../../../domain/Offer';
import { sum, subtract } from '../../../domain/Price';

import { LoggerService } from '../../../services/LoggerService';

import {
    PriceResponse,
    ProviderResponse,
    ConditionalFeeResponse,
    BookingRequestStatusResponse,
    ConditionalFeeTypeResponse,
    PaymentTypeResponse,
} from '../../response/HCRatesApiResponse';

import { mapPriceResponse, createPrice } from '../Price';

const feesMap = new Map<ConditionalFeeTypeResponse, FeeType>([
    [ConditionalFeeTypeResponse.AIRPORT_ACCESS_FEE, 'AIRPORT'],
    [ConditionalFeeTypeResponse.AIRPORT_CONCESSION_FEE_RECOVERY, 'AIRPORT'],
    [ConditionalFeeTypeResponse.AIRPORT_CONSTRUCTION_FEE, 'AIRPORT'],
    [ConditionalFeeTypeResponse.AIRPORT_CONTRACT_FEE, 'AIRPORT'],
    [ConditionalFeeTypeResponse.AIRPORT_FEE, 'AIRPORT'],
    [ConditionalFeeTypeResponse.AIRPORT_SURCHARGE, 'AIRPORT'],

    [ConditionalFeeTypeResponse.CITY_TAX, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.COUNTY_TAX, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.LESSOR_TAX, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.VAT_TAX, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.CITY_MITIGATION_FEE, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.TAX, 'ADDITIONAL_TAXES'],
    [ConditionalFeeTypeResponse.COUNTY_LICENSE_FEE, 'ADDITIONAL_TAXES'],

    [ConditionalFeeTypeResponse.ENVIRONMENTAL_SURCHARGE, 'ENVIRONMENTAL_TAX'],
    [ConditionalFeeTypeResponse.HIGHWAY_USE_CHARGE, 'ROAD_TAXES'],

    [ConditionalFeeTypeResponse.OUT_OF_HOURS_FEE, 'AFTER_HOURS'],
    [ConditionalFeeTypeResponse.ONE_WAY_FEE, 'ONE_WAY'],

    [ConditionalFeeTypeResponse.YOUNG_DRIVER, 'YOUNG_DRIVER'],
    [ConditionalFeeTypeResponse.YOUNGER_DRIVER, 'YOUNG_DRIVER'],
    [ConditionalFeeTypeResponse.SENIOR, 'OLD_DRIVER'],
    [ConditionalFeeTypeResponse.TOLLS, 'TOLLS'],
    [ConditionalFeeTypeResponse.DROP, 'DROP_OFF'],
    [ConditionalFeeTypeResponse.BORDER_CROSSING_FEE, 'CROSS_BORDER'],
    [ConditionalFeeTypeResponse.WINTER_SERVICE_CHARGE, 'WINTER_SERVICE'],

    [ConditionalFeeTypeResponse.VEHICLE_DELIVERY, 'VEHICLE_DELIVERY'],
    [ConditionalFeeTypeResponse.VEHICLE_COLLECTION, 'VEHICLE_DELIVERY'],
]);

const offerPaymentMethodsMap = new Map<PaymentTypeResponse, PaymentMethod>([
    [PaymentTypeResponse.PAYMENT_TYPE_AMEX, 'AMEX'],
    [PaymentTypeResponse.PAYMENT_TYPE_VISA, 'VISA'],
    [PaymentTypeResponse.PAYMENT_TYPE_MASTERCARD, 'MASTERCARD'],
]);

export const mapApiOfferPriceDetails = ({
    totalPrice: totalPriceResponse,
    atDeskPrice,
    providerResponse,
    fees,
    currencyCode,
    loggerService,
    rateId,
}: {
    atDeskPrice: PriceResponse | null;
    totalPrice: PriceResponse;
    providerResponse: ProviderResponse;
    fees: ConditionalFeeResponse[];
    currencyCode: string;
    loggerService: LoggerService;
    rateId: string;
}): PriceDetails => {
    const totalPrice = { ...mapPriceResponse(totalPriceResponse) };
    let basePrice = totalPrice;

    const indexedFees = new Map<string, Fee>();

    fees.forEach(fee => {
        const isIncluded = fee.included;
        const isMandatory = fee.status === BookingRequestStatusResponse.BOOK_CONFIRM;

        if (!fee.price || (!isIncluded && !isMandatory)) {
            return;
        }

        const feeType = feesMap.get(fee.conditionalfeetype) || 'UNKNOWN';
        const price = mapPriceResponse(fee.price);

        if (price.value < 0) {
            loggerService.logNegativePriceFee({ rateId, providerId: providerResponse.id, feeType });
        }

        // Some providers have the correct base price, some have the correct total price
        // This fixes both, we create our own base price, and if something is not properly mapped, we add to it
        if (isIncluded) {
            basePrice = subtract(basePrice, price);
        }

        // This key is used in order to not sum fees payed at different moments
        const key = `${feeType}-${fee.price.timeofpayment}-${isIncluded}`;

        const previous = indexedFees.get(key);
        if (previous) {
            // Sum with previous
            indexedFees.set(key, sum(previous, price));
        } else {
            // Just add new one
            indexedFees.set(key, { ...price, feeType, alreadyIncluded: isIncluded });
        }
    });

    return {
        carRentalPrice: basePrice,
        fees: Array.from(indexedFees.values()),
        dueAtDeskPrice: atDeskPrice ? mapPriceResponse(atDeskPrice) : createPrice({ currencyCode }),
        totalPrice,
        paymentMethods: providerResponse.acceptedpaymenttypesList
            .map(p => offerPaymentMethodsMap.get(p))
            .filter((p): p is PaymentMethod => Boolean(p)),
    };
};
