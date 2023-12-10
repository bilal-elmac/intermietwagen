import { RVError, RVErrorType } from './Error';
import { OneSizedArray } from '../utils/TypeUtils';

export enum PaymentMoment {
    PAY_AT_DESK = 'PAY_AT_DESK',
    PAY_ONLINE = 'PAY_ONLINE',
    MIXED = 'MIXED',
}

export interface Price {
    readonly currencyCode: string;
    readonly value: number;
    readonly taxPercentage: number | null;
    readonly payAt: PaymentMoment | null;
}

export type PriceRange = [Price | null, Price | null];

export const divide = ({ value, ...price }: Price, divider: number): Price => ({ ...price, value: value / divider });

const reduce = <P extends Price>(a: P, b: Price, multiplier: 1 | -1): P => {
    if (a.currencyCode !== b.currencyCode) {
        throw new RVError(
            RVErrorType.CURRENCIES_MISSMATCH,
            'Can not reduce prices as they have differet currency codes',
            [a.currencyCode, b.currencyCode, multiplier],
        );
    }

    return {
        ...a,
        value: a.value + multiplier * b.value,
        taxPercentage:
            a.taxPercentage === null || b.taxPercentage === null
                ? null
                : (a.taxPercentage * a.value + multiplier * b.taxPercentage * b.value) /
                  (a.value + multiplier * b.value),
        payAt: a.payAt === b.payAt ? a.payAt : PaymentMoment.MIXED,
    };
};

export const sum = <P extends Price>(a: P, b: Price): P => reduce(a, b, 1);
export const subtract = <P extends Price>(a: P, b: Price): P => reduce(a, b, -1);

export const min = (...prices: OneSizedArray<Price>): Price => prices.reduce((a, b) => (a.value < b.value ? a : b));
