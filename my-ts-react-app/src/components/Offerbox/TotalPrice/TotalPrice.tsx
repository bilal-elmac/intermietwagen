import React from 'react';

import { Price, divide } from '../../../domain/Price';

import PriceLabel from '../../../ui/PriceLabel';
import InfoButton from '../../../ui/InfoButton';
import { FormattedMessage } from 'react-intl';

export interface TotalPriceProps {
    readonly totalPrice: Price;
    readonly rentDays: number | null;
    readonly textPerDay: React.ReactNode;
    readonly offerBoxClass: string;
    readonly onClick?: () => void;
}

export const TotalPrice: React.FC<TotalPriceProps> = ({
    totalPrice,
    rentDays,
    textPerDay,
    offerBoxClass,
    onClick,
}): JSX.Element => (
    <div className={`${offerBoxClass}__payment-details__total-price`}>
        <span>
            <PriceLabel {...totalPrice} alwaysShowDecimals />
        </span>
        <InfoButton
            tooltipId={`${offerBoxClass}__payment-details__price-information`}
            buttonColor="grey"
            onIconClick={onClick}
        >
            <div className="w-48">
                <p className="text-sm">
                    <FormattedMessage id="TOOLTIP_OFFER_BOX_PRICE" />
                </p>
            </div>
        </InfoButton>
        {rentDays ? (
            <small>
                <PriceLabel {...divide(totalPrice, rentDays)} alwaysShowDecimals /> {textPerDay}
            </small>
        ) : null}
    </div>
);
