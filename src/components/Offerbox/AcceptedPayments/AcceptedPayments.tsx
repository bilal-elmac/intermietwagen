import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PaymentMethod } from '../../../domain/Offer';

import IconPayment from '../../../ui/IconPayment';
import Tooltip from '../../../ui/Tooltip';

interface Props {
    readonly paymentMethods: PaymentMethod[];
    readonly offerBoxClass: string;
}

export const AcceptedPayments: React.FC<Props> = ({ paymentMethods, offerBoxClass }): JSX.Element => (
    <Tooltip
        content={<FormattedMessage id="TOOLTIP_OFFER_BOX_PAYMENT_METHODS" />}
        className={`${offerBoxClass}__payment-details__accepted-payments flex`}
    >
        {paymentMethods.sort().map(paymentMethod => (
            <div key={paymentMethod} className="m-auto ml-1 mr-1">
                <IconPayment paymentMethod={paymentMethod} />
            </div>
        ))}
    </Tooltip>
);
