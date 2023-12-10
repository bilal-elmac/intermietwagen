import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Extra } from '../../domain/Offer';

import IconAvailability, { AvailabilityStatus } from '../IconAvailability';

interface Props {
    readonly extra: Extra;
}

export const ExtraPill = ({ extra }: Props): JSX.Element => (
    <div className="hc-results-view__extra-pill">
        <IconAvailability status={AvailabilityStatus.INFO}>
            <FormattedMessage id={`LABEL_${extra.toUpperCase()}_EXTRA`} />
        </IconAvailability>
    </div>
);
