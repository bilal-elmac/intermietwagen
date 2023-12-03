import React from 'react';
import { useIntl } from 'react-intl';
import { Price } from '../../domain/Price';

interface Args extends Price {
    readonly alwaysShowDecimals?: boolean;
    readonly alwaysHideDecimals?: boolean;
}

const renderPrice = ({ value, currencyCode, alwaysShowDecimals, alwaysHideDecimals }: Args): string =>
    useIntl().formatNumber(value, {
        minimumFractionDigits: alwaysShowDecimals ? 2 : 0,
        maximumFractionDigits: alwaysHideDecimals ? 0 : 2,
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: currencyCode,
    });

export const PriceLabel = (args: Args): JSX.Element => <>{renderPrice(args)}</>;
