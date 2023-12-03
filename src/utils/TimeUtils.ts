import { isValid, differenceInDays, parse as dateFnsParse, isBefore, startOfToday } from 'date-fns';
import { DateUtils } from 'react-day-picker';

import { SearchParameters } from '../domain/SearchParameters';
import { Language } from '../domain/Configuration';

import { getLocale } from './LocaleUtils';

export const isDateValid = (date: Date | null): date is Date => isValid(date);

export const calculateRentDays = ({
    pickUp: { time: pickUpTime },
    dropOff: { time: dropOffTime },
}: SearchParameters): number => differenceInDays(dropOffTime, pickUpTime);

type DateParser = (str: string, format: string) => Date | void;

export const createDateParser = (language: Language): DateParser => {
    const locale = getLocale(language);
    return (str: string, format: string): Date | void => {
        const parsed = dateFnsParse(str, format, new Date(), { locale });
        if (DateUtils.isDate(parsed) && !isBefore(parsed, startOfToday())) {
            return parsed;
        }
    };
};

const TIME_ZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;

export const parseTimezonelessDate = (date: string): Date => new Date(Date.parse(date) + TIME_ZONE_OFFSET);
export const formatToTimezonelessDate = (date: Date): string =>
    new Date(date.getTime() - TIME_ZONE_OFFSET).toISOString();
