import React from 'react';
import { FormattedMessage } from 'react-intl';

import { hasOffers as selectHasOffers } from '../../../domain/AppState';

import { useReduxState } from '../../../reducers/Actions';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';
import { Throttler } from '../../../utils/ThrottleUtils';

import { FilterOption } from '../../Filter/Option';
import IconMapPlace from '../../../ui/IconMapPlace';
import Button from '../../../ui/Button';

interface ButtonArgs {
    onChange: () => void;
    checked?: boolean;
}

const BASE_CLASS = 'hc-results-view__open-map-button-container';

const MobileMapButton: React.FC<ButtonArgs> = ({ onChange }): JSX.Element => (
    <button className="h-full w-full flex items-center pl-4" onClick={onChange}>
        <IconMapPlace />
        <span className="ml-2">
            <FormattedMessage id="LABEL_ENABLE_MAP_VIEW_CHECKBOX" />
        </span>
    </button>
);

const DesktopOpenMapButton: React.FC<ButtonArgs> = ({ checked, onChange }): JSX.Element => {
    /**
     * TODO Fix double call on click
     */
    const throttler = new Throttler(50);

    return (
        <div className={BASE_CLASS} onClick={(): void => throttler.run(onChange)}>
            <FilterOption isListItem={false} bordered checked={checked} onChange={(): void => void 0}>
                <FormattedMessage id="LABEL_ENABLE_MAP_VIEW_CHECKBOX" />
            </FilterOption>
            <Button
                id={`${BASE_CLASS}__hint-container`}
                className={`${BASE_CLASS}__hint-container`}
                onClick={(): void => void 0}
                version="inverted"
            >
                <FormattedMessage id="LABEL_SELECT_STATION_ON_MAP" />
            </Button>
        </div>
    );
};

export const ReducedOpenMapButton: React.FC<ButtonArgs> = ({ checked, onChange }): JSX.Element | null => {
    const hasOffers = useReduxState(selectHasOffers);
    const isDesktop = !isTabletOrSmaller();

    if (!hasOffers) {
        return null;
    }

    const InternalButton = isDesktop ? DesktopOpenMapButton : MobileMapButton;
    return <InternalButton checked={checked} onChange={onChange} />;
};
