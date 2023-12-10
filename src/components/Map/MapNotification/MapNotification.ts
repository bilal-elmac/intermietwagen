import React from 'react';
import { FormattedMessage } from 'react-intl';
import Notification from '../../../ui/Notification';
import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';
import { closeBanner } from '../../../reducers/BannerActions';

// in milliseconds
const CLOSE_AFTER = 5000;

export const MapNotification: React.FC<{}> = (): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const isNotificationOpen = useReduxState(s => s.banners.mapOffersUpdated);

    return (
        <Notification
            open={isNotificationOpen}
            className="hc-results-view__map__notification"
            onClose={(): void => {
                setTimeout(() => dispatch(closeBanner('mapOffersUpdated')), CLOSE_AFTER);
            }}
            title={<FormattedMessage id="LABEL_SEARCH_RESULTS_UPDATED_WARNING_TITLE" />}
        >
            <FormattedMessage id="LABEL_SEARCH_RESULTS_UPDATED_WARNING_CONTENT" />
        </Notification>
    );
};
