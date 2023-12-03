import React, { Fragment } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { differenceInDays } from 'date-fns';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import Button from '../../../ui/Button';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';

export interface OverlayProps {
    classNames: Record<string, string>;
    selectedDay: { from: Date | undefined; to: Date | undefined };
    children: React.ReactNode;
    inputname?: string;
    BASE_CLASS?: string;
    isSubmitDisabled?: boolean;
    handleReset: () => void;
    handleSubmit: () => void;
}

const DateLabel = ({ date }: { date: Date }): JSX.Element => (
    <>
        <b>
            <FormattedDate value={date} weekday="short" />{' '}
        </b>
        <span>
            <FormattedDate value={date} />
        </span>
    </>
);

const DateLabels = ({ from, to }: OverlayProps['selectedDay']): JSX.Element | null => {
    if (!from && !to) {
        return null;
    }

    const dates: JSX.Element[] = [];

    if (from) {
        dates.push(<DateLabel date={from} />);
    }

    if (from && to) {
        dates.push(<> - </>);
    }

    if (to) {
        dates.push(<DateLabel date={to} />);
    }

    if (to && from) {
        dates.push(<>, </>);

        dates.push(
            <span className="text-blue font-semibold">
                <FormattedMessage id="LABEL_CALENDAR_DAYS_SELECTED" values={{ days: differenceInDays(to, from) }} />
            </span>,
        );
    }

    return (
        <p className="text-xs hidden md:block">
            {dates.map((element, i) => (
                <Fragment key={i}>{element}</Fragment>
            ))}
        </p>
    );
};

export const CustomOverlay = ({
    BASE_CLASS = 'hc-results-view__date-time-picker',
    classNames,
    selectedDay,
    children,
    isSubmitDisabled,
    handleReset,
    handleSubmit,
    ...props
}: OverlayProps): JSX.Element => (
    <div
        className={`${classNames.overlayWrapper}`}
        style={!isTabletOrSmaller() ? { right: '40px' } : { position: 'absolute', left: '0', top: '65px' }}
        {...props}
    >
        <div className={classNames.overlay}>
            {children}
            <div className={`${classNames.overlay}__footer`}>
                <div className={`${classNames.overlay}__footer-nav`}>
                    <DateLabels {...selectedDay} />
                    <div className="self-end flex items-center justify-between w-full md:w-auto lg:w-auto lg:justify-end">
                        <Button
                            id={`${BASE_CLASS}__reset-btn`}
                            name="reset-date-btn"
                            version="inverted"
                            iconLeft={<CancelOutlinedIcon />}
                            onClick={handleReset}
                        >
                            <FormattedMessage id="LABEL_DATE_PICKER_RESET" />
                        </Button>
                        <Button
                            id={`${BASE_CLASS}__submit-btn`}
                            version={isSubmitDisabled ? 'disabled' : 'default'}
                            name="submit-date-btn"
                            onClick={(): void => handleSubmit()}
                        >
                            <FormattedMessage id="LABEL_DATE_PICKER_SUBMIT" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
