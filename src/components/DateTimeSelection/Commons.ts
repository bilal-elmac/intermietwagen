import { isBefore, isToday, isSameDay, setMinutes, getMinutes, getHours, startOfDay } from 'date-fns';

/**
 * Step in shown time options, in minutes
 */
export const TIME_SELECTION_STEP = 30;

export const BASE_CLASS = 'hc-results-view__date-time-picker';

/**
 * - Adds to the given date its minutes
 * - Makes sure the date is in the future (to the beginning of the 30 minutes period)
 */
export const correctTime = (newDate: Date, dateWithTime: Date): Date => {
    // Apply minutes to new date
    const newDateWithTime = setMinutes(startOfDay(newDate), getHours(dateWithTime) * 60 + getMinutes(dateWithTime));
    // Ensure date is in the future
    return isToday(newDateWithTime)
        ? setMinutes(
              newDateWithTime,
              // hours + round current date to beginning of an hour or half an hour + TIME_SELECTION_STEP
              getHours(new Date()) * 60 + getMinutes(new Date()) > 30 ? 30 : 0 + TIME_SELECTION_STEP,
          )
        : newDateWithTime;
};

/**
 * Ensure that the given timespan is actually feasible (Starts before it ends, with at least 30 minutes of duration)
 *
 * If the given timespan is not, it will either ignore the end, or, if both are on the same day, base the end one hour from the start
 */
export const ensureFeasibility = (
    [start, end]: [Date, Date],
    newestType: 'from' | 'to',
): [Date, Date] | [Date, null] => {
    if (isBefore(start, end)) {
        // Everything is ok
        return [start, end];
    }

    if (isSameDay(start, end)) {
        // It's either at the same time or after, but its within the same day
        // We accept the end, but push it to 30 minutes after
        return [start, setMinutes(startOfDay(start), getHours(start) * 60 + getMinutes(start) + TIME_SELECTION_STEP)];
    }

    // Use the newest selection as the start
    switch (newestType) {
        case 'from':
            return [start, null];
        case 'to':
            return [end, null];
    }
};
