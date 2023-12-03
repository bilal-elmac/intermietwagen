import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { CircularProgress } from '@material-ui/core';

import { Provider } from '../../domain/Provider';

import Button from '../../ui/Button';
import { useViewOfferStatus, ViewOfferState } from './OfferboxContext';

export interface ViewOfferSectionProps {
    readonly id: string;
    readonly orientation: 'horizontal' | 'vertical';
    readonly provider: Provider;

    readonly onGoToOffer: () => void;
    readonly onGoToPartnerOffer: (() => void) | null;
}

const OfferButton = ({
    id,
    className,
    onClick,
    state,
    children,
}: {
    id: string;
    className: string;
    onClick: () => void;
    state: ViewOfferState;
    children: React.ReactNode;
}): JSX.Element => (
    <Button
        id={id}
        name={id}
        onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            onClick();
        }}
        className={className}
        version={state === ViewOfferState.LOADING ? 'disabled' : 'default'}
    >
        {state === ViewOfferState.LOADING ? <CircularProgress size={18} /> : children}
    </Button>
);

export const ViewOfferSection: React.FC<ViewOfferSectionProps> = ({
    id,
    provider: { name },
    orientation,
    onGoToOffer,
    onGoToPartnerOffer,
}): JSX.Element => {
    const [state] = useViewOfferStatus();

    const patternButton = onGoToPartnerOffer && (
        <OfferButton
            id={`${id}-partner`}
            onClick={onGoToPartnerOffer}
            className="hc-results-view__view-offer-section__offer-button--partner"
            state={state}
        >
            <FormattedMessage id="LABEL_GO_TO_OFFER" values={{ isPartner: Boolean(name), partner: name }} />
        </OfferButton>
    );

    return (
        <div
            className={classNames(
                `hc-results-view__view-offer-section--${orientation}`,
                state === ViewOfferState.INITIAL && 'initial',
                state === ViewOfferState.LOADING && 'loading',
                state === ViewOfferState.LOADED && 'loaded',
            )}
        >
            {orientation === 'horizontal' && patternButton}

            <OfferButton
                id={id}
                onClick={onGoToOffer}
                className="hc-results-view__view-offer-section__offer-button"
                state={state}
            >
                <FormattedMessage id="LABEL_GO_TO_OFFER" values={{ isPartner: false, partner: null }} />
            </OfferButton>

            {orientation === 'vertical' && patternButton}
        </div>
    );
};
