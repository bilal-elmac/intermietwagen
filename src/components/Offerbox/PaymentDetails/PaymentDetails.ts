import React from 'react';

interface Props {
    readonly children: React.ReactNode;
    readonly offerBoxClass: string;
}

export const PaymentDetails: React.FC<Props> = ({ children, offerBoxClass }): JSX.Element => (
    <div className={`${offerBoxClass}__payment-details`}>{children}</div>
);
