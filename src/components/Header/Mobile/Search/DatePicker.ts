import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useDatePicker } from '../../../../state/DatePicker.context';

import { DateSelection } from '../../../DateTimeSelection';

export const DatePicker: React.FunctionComponent<{}> = () => {
    const [datepickerState] = useDatePicker();
    return (
        <div className="hc-results-view__header-searchbar__mobile-drawer flex flex-col bg-light-blue pb-2 h-screen md:h-auto">
            <div className="flex">
                <div className="w-1/2 text-sm text-dark-grey pl-2 py-1">
                    <FormattedMessage id="LABEL_NAVIGATION_PICKUP" />
                </div>
                <div className="w-1/2 text-sm text-dark-grey pl-2 py-1">
                    <FormattedMessage id="LABEL_NAVIGATION_DROPOFF" />
                </div>
            </div>
            <div className="flex relative">
                <div className="pickup-date h-16 border-b border-solid border-outline w-full bg-white">
                    <DateSelection {...datepickerState} />
                </div>
            </div>
        </div>
    );
};
