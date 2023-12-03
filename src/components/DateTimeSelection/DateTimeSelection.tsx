import React, { RefObject, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { DateUtils, Modifiers, DayPickerProps, DayPickerInputProps } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { useIntl } from 'react-intl';

import { isBefore } from 'date-fns';
import { ChevronRightRounded } from '@material-ui/icons';

import { useReduxState } from '../../reducers/Actions';
import { DatePickerContextState, useDatePickerDispatch } from '../../state/DatePicker.context';
import { useServices } from '../../state/Services.context';
import { useNavigation } from '../../state/Navigation.context';
import { isModalShowing } from '../../ui/Modal';

import TimeSelection from './TimeSelection';
import { CustomOverlay as DateTimeSelectionOverlay, OverlayProps } from './Overlay/DateTimeSelectionOverlay';
import { CustomNavbar as DateTimeSelectionNavBar } from './NavBar/DateTimeSelectionNavBar';
import PulseLoader, { WhitesmokePatch } from '../../ui/PulseLoader';
import CalendarIcon from './CalendarIcon';

import { calendarLocaleUtils as localeUtils } from '../../utils/LocaleUtils';
import { isTabletOrSmaller, isMobile } from '../../utils/MediaQueryUtils';
import { createDateParser as useDateParser } from '../../utils/TimeUtils';

import { correctTime, ensureFeasibility, BASE_CLASS } from './Commons';

const useDayPickerInputProps = (): DayPickerInputProps => {
    const intl = useIntl();
    const language = useReduxState(s => s.staticConfiguration.language);
    const format = useReduxState(s => s.staticConfiguration.dateFormat);

    return {
        format,
        formatDate: (date: Date): string =>
            intl.formatDate(date, { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' }),
        parseDate: useDateParser(language),
        hideOnDayClick: false,
        inputProps: { ref: null },
    };
};

const CaptionElement: DayPickerProps['captionElement'] = ({ classNames: { caption }, date, locale, localeUtils }) => (
    <div className={caption} role="heading">
        <div>
            {localeUtils.formatMonthTitle(date, locale)} {date.getFullYear()}
        </div>
    </div>
);

const useDatePickers = (): {
    from: RefObject<DayPickerInput>;
    to: RefObject<DayPickerInput>;
    hide: (calendarToHide: 'to' | 'from' | 'both') => void;
} => {
    const fromDayPickerRef = useRef<DayPickerInput>(null);
    const toDayPickerRef = useRef<DayPickerInput>(null);

    return {
        from: fromDayPickerRef,
        to: toDayPickerRef,
        hide: (calendarToHide): void => {
            const to = toDayPickerRef && toDayPickerRef.current;
            const from = fromDayPickerRef && fromDayPickerRef.current;
            switch (calendarToHide) {
                case 'to':
                    to && to.hideDayPicker();
                    break;
                case 'from':
                    from && from.hideDayPicker();
                    break;
                default:
                    to && to.hideDayPicker();
                    from && from.hideDayPicker();
            }
        },
    };
};

const DateSelection: React.FC<DatePickerContextState> = ({
    isCalendarOpen,
    submittedSelection: { start: pickUp, end: dropOff },
    unfinishedSelection: { start: from, end: to },
}) => {
    const [, updateNavigation] = useNavigation();
    const locale = useReduxState(s => s.staticConfiguration.language);
    const isShowingModal = isModalShowing();

    const isPhone = isMobile();
    const isTablet = isTabletOrSmaller();

    const { analyticsService } = useServices();
    const updateDateTimeState = useDatePickerDispatch();
    const baseDayPickerInputProps = useDayPickerInputProps();

    const datePickers = useDatePickers();
    const fromDayPickerInputRef = useRef<HTMLInputElement>(null);
    const toDayPickerInputRef = useRef<HTMLInputElement>(null);

    // sets the disabled and selected dates on date picker
    const modifiers: Partial<Modifiers> = to
        ? { disabled: { before: new Date() }, start: from, end: to }
        : { disabled: { before: new Date() }, start: from };

    const submitCalendarSelection = (from: Date, to: Date | null): void => {
        if (from && to && isBefore(from, to)) {
            updateDateTimeState({ type: 'SET_SUBMITTED_SELECTION', payload: [from, to] });
        }
        updateDateTimeState({ type: 'SET_CALENDAR_VISIBILITY', payload: false });
    };

    const onDayPickerShowHandler = (calendarType: 'to' | 'from'): void => {
        // hide another calendar when current opens
        const calendarToHide = calendarType === 'from' ? 'to' : 'from';
        const currentCalendarRef = calendarType === 'from' ? fromDayPickerInputRef : toDayPickerInputRef;

        currentCalendarRef?.current?.parentElement?.classList.add('DayPickerInput--active');
        updateDateTimeState({ type: 'SET_CALENDAR_VISIBILITY', payload: true });
        if (!isTablet) {
            updateNavigation({ type: 'SET_HELP_VISIBILITY', payload: false });
        }
        datePickers.hide(calendarToHide);
    };

    const reset = (): void => {
        if (pickUp && dropOff) {
            updateDateTimeState({ type: 'SET_TEMPORARY_SELECTION', payload: [pickUp, dropOff] });
        }
    };

    useEffect(() => {
        // hide calendars on state change from outside
        if (!isCalendarOpen || isShowingModal) {
            datePickers.hide('both');
            reset();
        }

        if (isShowingModal) {
            updateDateTimeState({ type: 'SET_CALENDAR_VISIBILITY', payload: false });
        }
    }, [isCalendarOpen, isShowingModal]);

    if (!pickUp || !dropOff) {
        return (
            <PulseLoader className="h-8 flex w-full my-2">
                <WhitesmokePatch className="h-full w-6 ml-auto bg-white" />
                <WhitesmokePatch className="h-full w-6 ml-auto bg-white" />
            </PulseLoader>
        );
    }

    const overrideOverlayProps: Partial<OverlayProps> = {
        selectedDay: { from: from || undefined, to: to || undefined },
        isSubmitDisabled: !to,
        BASE_CLASS: BASE_CLASS,
        handleReset: reset,
        handleSubmit: () => submitCalendarSelection(from, to),
    };

    const baseDayPickerProps: DayPickerProps = {
        selectedDays: to ? [from, { from, to }] : from,
        locale,
        localeUtils,
        modifiers,
        month: from,
        fromMonth: new Date(),
        pagedNavigation: true,
        captionElement: CaptionElement,
        numberOfMonths: isPhone ? 1 : 2,
        navbarElement: (
            <DateTimeSelectionNavBar
                onPreviousClick={(): void => void 0}
                onNextClick={(): void => void 0}
                className="hc-results-view__date-time-picker__navbar"
            />
        ),
    };

    return (
        <div className={classNames(`${BASE_CLASS}__pickup-wrapper`, 'flex items-center w-full', isTablet && 'h-full')}>
            {!isPhone && <CalendarIcon className="text-blue" />}
            <div className={`${BASE_CLASS}__pickup-date h-full w-full`}>
                <div className="w-full flex md:pr-2 lg:pr-0 lg:items-center">
                    <div className="h-16 border-r border-solid border-outline lg:border-0 w-full md:w-1/2 lg:w-full bg-white lg:bg-transparent lg:h-12">
                        <DayPickerInput
                            {...baseDayPickerInputProps}
                            component={(props: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
                                <input {...props} ref={fromDayPickerInputRef} onBlur={(): void => void 0} />
                            )}
                            keepFocus={false}
                            ref={datePickers.from}
                            value={isCalendarOpen ? from : pickUp || undefined}
                            overlayComponent={(props: OverlayProps): JSX.Element => (
                                <DateTimeSelectionOverlay
                                    {...props}
                                    {...overrideOverlayProps}
                                    inputname="fromDateInput"
                                />
                            )}
                            dayPickerProps={baseDayPickerProps}
                            onDayPickerHide={(): void =>
                                fromDayPickerInputRef?.current?.parentElement?.classList.remove(
                                    'DayPickerInput--active',
                                )
                            }
                            onDayPickerShow={(): void => onDayPickerShowHandler('from')}
                            onDayChange={(date, modifiers): void => {
                                if (modifiers.disabled || !DateUtils.isDate(date)) {
                                    return;
                                }

                                // Correct time
                                const correctedTime = correctTime(date, from);

                                // Check if dates are possible
                                const feasibleDates = to
                                    ? ensureFeasibility([correctedTime, to], 'from')
                                    : ([correctedTime, null] as [Date, null]);

                                updateDateTimeState({ type: 'SET_TEMPORARY_SELECTION', payload: feasibleDates });
                                analyticsService.onPickUpDateChange();

                                toDayPickerInputRef.current?.focus();
                            }}
                        />
                    </div>
                    {!isPhone && (
                        <div className="h-16 w-1/2 bg-white lg:flex lg:bg-transparent lg:h-12">
                            <TimeSelection type="PICKUP" />
                        </div>
                    )}
                </div>
            </div>
            {!isTablet && <ChevronRightRounded />}
            <div className={`${BASE_CLASS}__dropoff-date h-full w-full`}>
                <div className="w-full flex md:pl-2 lg:items-center">
                    <div className="h-16 border-r border-solid border-outline lg:border-0 w-full md:w-1/2 lg:w-full bg-white lg:bg-transparent lg:h-12">
                        <DayPickerInput
                            {...baseDayPickerInputProps}
                            component={(props: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
                                <input
                                    {...props}
                                    className={classNames(props.className, !to && 'invisible')}
                                    ref={toDayPickerInputRef}
                                    onBlur={(): void => void 0}
                                />
                            )}
                            ref={datePickers.to}
                            value={isCalendarOpen ? to || '' : dropOff || undefined}
                            overlayComponent={(props: OverlayProps): JSX.Element => (
                                <DateTimeSelectionOverlay
                                    {...props}
                                    {...overrideOverlayProps}
                                    inputname="toDateInput"
                                />
                            )}
                            dayPickerProps={baseDayPickerProps}
                            onDayPickerHide={(): void => {
                                toDayPickerInputRef?.current?.parentElement?.classList.remove('DayPickerInput--active');
                            }}
                            onDayPickerShow={(): void => onDayPickerShowHandler('to')}
                            onDayChange={(date, modifiers): void => {
                                if (modifiers.disabled || !DateUtils.isDate(date)) {
                                    return;
                                }

                                // Correct time
                                const correctedTime = correctTime(date, to || from);

                                // Check if dates are possible
                                const feasibleDates = ensureFeasibility([from, correctedTime], 'to');

                                updateDateTimeState({ type: 'SET_TEMPORARY_SELECTION', payload: feasibleDates });
                                analyticsService.onPickUpDateChange();

                                // If the end is not set, dont leave this picker
                                if (feasibleDates[1]) {
                                    fromDayPickerInputRef.current?.focus();
                                }
                            }}
                        />
                    </div>

                    {!isPhone && (
                        <div className="h-16 w-1/2 bg-white lg:flex lg:bg-transparent lg:h-12">
                            <TimeSelection type="DROPOFF" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DateSelection;
