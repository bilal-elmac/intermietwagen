import React from 'react';
import { FormattedMessage } from 'react-intl';

import { boldFormatter } from '../../../utils/FormatterUtils';
import { isMobile } from '../../../utils/MediaQueryUtils';

import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';
import { closeBanner } from '../../../reducers/BannerActions';

import ClosableCard from '../../../ui/ClosableCard';

interface CovidSectionProps {
    readonly className: string;
}

export const CovidSection = ({ className }: CovidSectionProps): JSX.Element | null => {
    const show = useReduxState(s => s.staticConfiguration.displayCovidBanner && s.banners.covidBanner);
    const dispatch = useReduxDispatch();
    const isMobileDevice = isMobile();

    if (!show) {
        return null;
    }

    className += '__covid-section';

    return (
        <ClosableCard
            className={className}
            size="tiny"
            buttonType={isMobileDevice ? 'absolute' : 'right'}
            noShadow
            onClose={(): void => {
                dispatch(closeBanner('covidBanner'));
            }}
        >
            <p className={`${className}__text-section`}>
                <FormattedMessage
                    id="LABEL_COVID_BANNER_SECTION"
                    values={{
                        b: boldFormatter,
                    }}
                />
            </p>
        </ClosableCard>
    );
};
