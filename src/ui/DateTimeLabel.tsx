import React from 'react';
import { FormattedTime, FormattedDate } from 'react-intl';

import { useReduxState } from '../reducers/Actions';

export const TimeLabel = ({ value }: { value: string | number | Date }): JSX.Element => {
    const hour12 = useReduxState(s => s.staticConfiguration.is12HourFormat);
    return <FormattedTime value={value} hour12={hour12} />;
};

export const DateLabel = ({
    value,
    ...props
}: { value: string | number | Date } & Partial<Intl.DateTimeFormatOptions>): JSX.Element => (
    <FormattedDate value={value} weekday="short" year="numeric" month="numeric" day="numeric" {...props} />
);
