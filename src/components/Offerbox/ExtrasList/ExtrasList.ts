import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Extra } from '../../../domain/Offer';

import ExtraPill from '../../../ui/ExtraPill';
import Tooltip from '../../../ui/Tooltip';

interface Props {
    readonly extras: Extra[];
    readonly offerBoxClass: string;
}

export const ExtrasList: React.FC<Props> = ({ extras, offerBoxClass }): JSX.Element | null => {
    if (extras.length === 0) {
        return null;
    }

    const extrasList = extras.sort().map((extra, idx) => (
        <li key={idx}>
            <ExtraPill extra={extra}></ExtraPill>
        </li>
    ));

    return (
        <Tooltip
            content={<FormattedMessage id="TOOLTIP_OFFER_BOX_EXTRAS" />}
            className={`${offerBoxClass}__availability-container__extras-container`}
        >
            <span className={`${offerBoxClass}__availability-container__extras-container__title`}>
                <FormattedMessage id="LABEL_EXTRAS" />:
            </span>
            <ul>{extrasList}</ul>
        </Tooltip>
    );
};
