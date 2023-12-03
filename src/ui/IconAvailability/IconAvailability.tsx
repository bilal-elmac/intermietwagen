import React from 'react';
import classNames from 'classnames';

import { CheckCircle, Error } from '@material-ui/icons';

interface Args {
    readonly children: React.ReactNode;
    readonly customClassNames?: string;
}

export enum AvailabilityStatus {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

const BASE_CLASS = 'hc-results-view__icon-availability';

const Wrapper = ({ children, customClassNames }: Args): JSX.Element => (
    <span className={classNames(customClassNames, `${BASE_CLASS}-wrapper`)}>{children}</span>
);

const Icon = ({ status }: { readonly status: AvailabilityStatus }): JSX.Element => {
    switch (status) {
        case AvailabilityStatus.INFO:
            return <CheckCircle className={classNames(BASE_CLASS, `${BASE_CLASS}--info`)} />;
        case AvailabilityStatus.WARNING:
            return <Error className={classNames(BASE_CLASS, `${BASE_CLASS}--warning`)} />;
        case AvailabilityStatus.ERROR:
            return <Error className={classNames(BASE_CLASS, `${BASE_CLASS}--error`)} />;
    }
};

export const IconAvailability = ({
    status,
    children,
    ...others
}: {
    readonly status: AvailabilityStatus;
} & Args): JSX.Element => (
    <Wrapper {...others}>
        <Icon status={status} />
        {children}
    </Wrapper>
);
