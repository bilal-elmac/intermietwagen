import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@material-ui/core';

import { PriceDetails as PriceDetailsModel } from '../../../../domain/Offer';
import { PaymentMoment, Price } from '../../../../domain/Price';

import PriceLabel from '../../../../ui/PriceLabel';
import { TabProps } from '../Panel';

interface Props {
    readonly customClassNames?: string;
    readonly priceDetails: PriceDetailsModel;
}

const FootNote = ({ label, index }: { label: string; index: number }): JSX.Element => (
    <small className="block">
        <sup>{index} </sup>
        <FormattedMessage id={label} />
    </small>
);

const Row = ({
    bold,
    label,
    price,
    footNote = 0,
    hideFree,
}: {
    readonly label: string;
    readonly price: Price;
    readonly bold?: boolean;
    readonly footNote?: number;
    readonly hideFree?: boolean;
}): JSX.Element => (
    <TableRow {...(bold ? { className: 'font-bold' } : {})}>
        <TableCell {...(bold ? { style: { fontWeight: 'inherit' } } : {})} component="th" scope="row">
            <FormattedMessage id={label} />
            {price.value > 0 && footNote > 0 && <sup>{footNote}</sup>}
        </TableCell>
        <TableCell {...(bold ? { style: { fontWeight: 'inherit' } } : {})} align="right">
            {price.value === 0 && hideFree ? null : <PriceLabel {...price} alwaysShowDecimals />}
        </TableCell>
    </TableRow>
);

const PriceDetails: React.FC<Props & TabProps> = ({
    customClassNames,
    tabLabel,
    priceDetails: { carRentalPrice, fees, dueAtDeskPrice, totalPrice },
}) => {
    let payAtDesk = false;
    let alreadyIncluded = false;

    fees.forEach(f => {
        if (f.value > 0) {
            alreadyIncluded = alreadyIncluded || f.alreadyIncluded;
            payAtDesk = payAtDesk || f.payAt === PaymentMoment.PAY_AT_DESK;
        }
    });

    const footNotes = [];
    if (payAtDesk) {
        footNotes.push('LABEL_FEES_PAYED_AT_PICKUP');
    }
    if (alreadyIncluded) {
        footNotes.push('LABEL_FEES_INCLUDED_TOTAL_PRICE');
    }

    return (
        <div className={customClassNames}>
            <h2 className="text-xl font-bold mb-4">
                <FormattedMessage id={tabLabel} />
            </h2>
            <div className="w-2/4">
                <TableContainer className="mb-4">
                    <Table size="small">
                        <TableBody>
                            <Row label="LABEL_PRICE_RENTAL_CAR" price={carRentalPrice} hideFree />
                            <>
                                {fees.map(fee => (
                                    <Row
                                        key={fee.feeType}
                                        label={`LABEL_${fee.feeType}_FEE`}
                                        price={fee}
                                        footNote={fee.payAt === PaymentMoment.PAY_AT_DESK ? 1 : 0}
                                        hideFree
                                    />
                                ))}
                            </>
                            {Boolean(dueAtDeskPrice.value) && (
                                <Row bold label="LABEL_DUE_AT_DESK_PRICE" price={dueAtDeskPrice} />
                            )}
                            <Row
                                bold
                                label="LABEL_TOTAL_PRICE"
                                price={totalPrice}
                                footNote={alreadyIncluded ? footNotes.length : 0}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
                {footNotes.map((label, k) => (
                    <FootNote key={k} index={k + 1} label={label} />
                ))}
            </div>
        </div>
    );
};

export default PriceDetails;
