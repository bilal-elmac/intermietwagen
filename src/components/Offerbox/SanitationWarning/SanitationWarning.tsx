import React from 'react';
import { FormattedMessage } from 'react-intl';
import IconCleanWheel from '../../../ui/IconCleanWheel';

interface Props {
    readonly onClick: () => void;
}

export const SanitationWarning = ({ onClick }: Props): JSX.Element | null => (
    <div className="hc-results-view__sanitation-warning">
        <div className="hc-results-view__sanitation-warning__inner" onClick={onClick}>
            <div className="hc-results-view__sanitation-warning__icon-wrapper">
                <IconCleanWheel />
            </div>
            <p className="hc-results-view__sanitation-warning__description">
                <FormattedMessage id="LABEL_SANITIZED_WARNING" />
            </p>
        </div>
    </div>
);
