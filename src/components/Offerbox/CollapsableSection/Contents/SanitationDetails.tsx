import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Provider } from '../../../../domain/Provider';

import { TabProps } from '../Panel';
import IconAvailability, { AvailabilityStatus } from '../../../../ui/IconAvailability';

const Detail = ({ labelKey }: { labelKey: string }): JSX.Element => (
    <li>
        <IconAvailability status={AvailabilityStatus.INFO}>
            <FormattedMessage id={labelKey} />
        </IconAvailability>
    </li>
);

const SanitationDetails: React.FC<TabProps & { provider: Provider; className: string }> = ({
    provider: { name: provider },
    className,
}) => (
    <div className={className}>
        <h1 className="font-bold text-xl uppercase">
            <FormattedMessage id="LABEL_SANITATION_DETAILS" />:
        </h1>
        <p className="text-sm mt-1">
            <FormattedMessage id="LABEL_SANITATION_DESCRIPTION_FIRST_PARAGRAPH" values={{ provider }} />
        </p>
        <p className="text-sm mb-1">
            <FormattedMessage id="LABEL_SANITATION_DESCRIPTION_SECOND_PARAGRAPH" />
        </p>
        <ul className="text-sm leading-loose">
            <Detail labelKey="LABEL_SANITATION_ACCESS_TO_STATION" />
            <Detail labelKey="LABEL_SANITATION_SOCIAL_DISTANCING_RULES" />
            <Detail labelKey="LABEL_SANITATION_MASK_RULES" />
            <Detail labelKey="LABEL_SANITATION_AFTER_USE_CLEAN_UP" />
            <Detail labelKey="LABEL_SANITATION_HAND_DISINFECTER_AVAILABILITY" />
            <Detail labelKey="LABEL_SANITATION_AFTER_DROPOFF_CLEAN_UP" />
        </ul>
    </div>
);

export default SanitationDetails;
