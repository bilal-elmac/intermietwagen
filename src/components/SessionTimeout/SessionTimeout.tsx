import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Replay, ChevronRight } from '@material-ui/icons';

import { isExpired as selectIsExpired } from '../../domain/LoadingStatus';
import { Place } from '../../domain/Location';
import { Time } from '../../domain/SearchParameters';

import { useReduxDispatch, useReduxState } from '../../reducers/Actions';
import { restartSearch } from '../../reducers/SearchActions';

import Logo from './SessionTimeoutLogo';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { DateLabel, TimeLabel } from '../../ui/DateTimeLabel';

import { isMobile } from '../../utils/MediaQueryUtils';
import { scrollToTop } from '../../utils/ScrollUtils';
import { boldFormatter } from '../../utils/FormatterUtils';

const BASE_CLASS = 'hc-session-modal';
const DATE_FORMAT: Partial<Intl.DateTimeFormatOptions> = { weekday: 'long', month: 'long' };

interface InfoArgs {
    locationName: Place['locationName'] | null;
    time: Time['time'] | null;
    type: 'pickup' | 'dropoff';
}

const PickupDropoffInfo = ({ locationName, time, type }: InfoArgs): JSX.Element => (
    <div className={`${BASE_CLASS}__session-info__pickup`}>
        <section className={`${BASE_CLASS}__session-info__${type}__wrapper`}>
            {locationName && (
                <section>
                    <h3>
                        <FormattedMessage id={`LABEL_NAVIGATION_${type.toUpperCase()}_PLACE`} />
                    </h3>
                    {locationName}
                </section>
            )}
            {time && (
                <section className="mt-4">
                    <h3>
                        <FormattedMessage id={`LABEL_NAVIGATION_${type.toUpperCase()}`} />
                    </h3>
                    <DateLabel value={time} {...DATE_FORMAT} /> <TimeLabel value={time} />
                </section>
            )}
        </section>
    </div>
);

export const SessionTimeoutModal: React.FC<{}> = () => {
    const dispatch = useReduxDispatch();

    const isExpired = useReduxState(app => selectIsExpired(app.loading));
    const search = useReduxState(s => s.search);
    const style = isMobile()
        ? { width: '100%', maxHeight: '300px' }
        : { width: '570px', minHeight: '400px', maxHeight: '432px' };
    const isMobileFlag = isMobile();

    if (!isExpired) {
        return null;
    }

    return (
        <Modal style={style} className={BASE_CLASS}>
            <div className={`${BASE_CLASS}__icon`}>
                <Logo />
            </div>
            <p className={`${BASE_CLASS}__message`}>
                <FormattedMessage
                    id="LABEL_SESSION_EXPIRED_MESSAGE"
                    values={{
                        b: boldFormatter,
                    }}
                />
            </p>
            {search && !isMobileFlag && (
                <div className={`${BASE_CLASS}__session-info`}>
                    <PickupDropoffInfo {...search.pickUp} type="pickup" />
                    <span className={`${BASE_CLASS}__session-info__separator`}>
                        <ChevronRight />
                    </span>
                    <PickupDropoffInfo {...search.dropOff} type="dropoff" />
                </div>
            )}
            <div className={`${BASE_CLASS}__button`}>
                <Button
                    id={`${BASE_CLASS}__button`}
                    name="session-modal-btn"
                    iconLeft={<Replay />}
                    onClick={(): void => {
                        scrollToTop();
                        dispatch(restartSearch());
                    }}
                >
                    <span className="ml-1">
                        <FormattedMessage id="BUTTON_SESSION_EXPIRED" />
                    </span>
                </Button>
            </div>
        </Modal>
    );
};
