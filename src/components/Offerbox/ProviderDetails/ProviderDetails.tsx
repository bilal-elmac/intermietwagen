import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Tooltip from '../../../ui/Tooltip';
import { boldFormatter } from '../../../utils/FormatterUtils';
import { unifyProperName } from '../../../utils/StringUtils';

export interface Props {
    readonly providerName: string | null;
    readonly offerBoxClass: string;
}

export const ProviderDetails: React.FC<Props> = ({ providerName, offerBoxClass }): JSX.Element | null => {
    const intl = useIntl();
    if (!providerName) {
        return null;
    }
    const tooltipText = intl.formatMessage(
        { id: 'TOOLTIP_OFFER_BOX_PROVIDER' },
        { providerName: unifyProperName(providerName), strong: boldFormatter },
    );
    const tooltipContent = (
        <div className={`${offerBoxClass}__provider-info__tooltip w-auto max-w-xs text-left`}>
            <header className="bg-light-blue p-3 py-2 text-lg font-bold">{providerName}</header>
            {tooltipText !== ' ' && <p className="p-3 text-sm">{tooltipText}</p>}
        </div>
    );

    return (
        <Tooltip content={tooltipContent} wrapContent={false} className={`${offerBoxClass}__provider-info`}>
            <span className={`${offerBoxClass}__provider-info__label-provider`}>
                <FormattedMessage id="LABEL_PROVIDER" />:
            </span>
            <span className={`${offerBoxClass}__provider-info__provider-name`}>{providerName}</span>
        </Tooltip>
    );
};
