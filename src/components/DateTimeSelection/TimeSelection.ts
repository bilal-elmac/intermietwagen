import React from 'react';
import { addMinutes, endOfDay, format, getMinutes, max, startOfDay, startOfHour, getHours } from 'date-fns';

import { useReduxState } from '../../reducers/Actions';

import Dropdown from '../../ui/Dropdown';

import { useServices } from '../../state/Services.context';
import { useDatePicker } from '../../state/DatePicker.context';
import { useNavigation } from '../../state/Navigation.context';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';
import { shouldRender } from '../../utils/ReactUtilts';

import { ensureFeasibility, BASE_CLASS, TIME_SELECTION_STEP } from './Commons';

/**
 * Yields a date that is both in the future (up to an hour) and after the given point (up to an hour)
 */
const resolveMinimalDate = (start: Date | null): Date => {
    const minDates = [
        // Next hour at 00m
        startOfHour(new Date()),
    ];

    if (start) {
        // The start date has also to be accounted for
        minDates.push(startOfHour(start));
    }

    return addMinutes(max(minDates), TIME_SELECTION_STEP);
};

type DropdownProps = { options: { offset: number; stringToShow: string }[]; selectedIndex: number };

const generateDropdownProps = (minimalDate: Date, currentDate: Date, timeFormat: string): DropdownProps => {
    const startTime = max([startOfDay(currentDate), minimalDate]);
    const minutes = getHours(currentDate) * 60 + getMinutes(currentDate);

    let selectedIndex = 0;

    const options: DropdownProps['options'] = [];
    for (let index = startTime; index < endOfDay(currentDate); index = addMinutes(index, TIME_SELECTION_STEP)) {
        const offset = getHours(index) * 60 + getMinutes(index);
        if (minutes === offset) {
            selectedIndex = options.length;
        }

        options.push({ offset, stringToShow: format(index, timeFormat) });
    }

    return { options, selectedIndex };
};

const TimeSelection: React.FC<{ type: 'PICKUP' | 'DROPOFF' }> = ({ type }) => {
    const is12HourFormat = useReduxState(s => s.staticConfiguration.is12HourFormat);
    const { analyticsService } = useServices();
    const [{ isCalendarOpen, submittedSelection, unfinishedSelection }, updateDateTimeState] = useDatePicker();
    const [, updateNavigation] = useNavigation();
    const isTablet = isTabletOrSmaller();

    const { start, end } = isCalendarOpen ? unfinishedSelection : submittedSelection;
    const date = type === 'PICKUP' ? start : end;

    /**
     * The dropdown has issues re-rendering values changed on the outside
     * This needs to be fixed eventually
     * This is a hotfix
     */
    if (!shouldRender(date && date.getTime()) || !date) {
        return null;
    }

    // We cannot use intl, as it starts day with 24:00 and we need 00:00 using date-fns for formatting
    const timeFormat = is12HourFormat ? 'hh:mm bbbb' : 'HH:mm';
    const startTime = resolveMinimalDate(type === 'DROPOFF' ? start : null);
    const { options, selectedIndex } = generateDropdownProps(startTime, date, timeFormat);

    return (
        <div
            className={`${BASE_CLASS}__time px-3 py-3 lg:p-0 lg:my-auto lg:mb-2`}
            onClick={(): void =>
                !isTablet ? updateNavigation({ type: 'SET_HELP_VISIBILITY', payload: false }) : undefined
            }
        >
            <Dropdown
                items={options.map(option => option.stringToShow)}
                customMenuStyles={`text-center lg:w-${is12HourFormat ? '32' : '24'}`}
                customButtonText={options[selectedIndex].stringToShow}
                initialSelectedIndex={selectedIndex}
                onOpen={(e): void => {
                    if (!isTablet) {
                        updateDateTimeState({ type: 'SET_OVERLAY_VISIBILITY', payload: e.isOpen === true });
                    }
                }}
                onChange={(e): void => {
                    const option = options.find(item => item.stringToShow === e.selectedItem);

                    if (!option) {
                        return;
                    }

                    // Merge date with new offset
                    const newDate = addMinutes(startOfDay(date), option.offset);

                    // Generate feasible dates
                    const newDates =
                        type === 'PICKUP'
                            ? end && ensureFeasibility([newDate, end], 'from')
                            : start && ensureFeasibility([start, newDate], 'to');

                    if (!newDates) {
                        return;
                    }

                    updateDateTimeState({
                        type: isCalendarOpen ? 'SET_TEMPORARY_SELECTION' : 'SET_SUBMITTED_SELECTION',
                        payload: newDates,
                    });

                    analyticsService.onTimeChange();
                }}
                customControlStyles={is12HourFormat ? 'text-sm' : 'text-base'}
                customItemStyles="justify-center"
            />
        </div>
    );
};

export default TimeSelection;
