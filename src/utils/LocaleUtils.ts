import { it, nl, es, fr, de, pl, enUS } from 'date-fns/locale';
import { LocaleUtils } from 'react-day-picker';

import { Language } from '../domain/Configuration';

const localesMap: Record<Language, Locale> = {
    es,
    nl,
    it,
    fr,
    en: enUS,
    de,
    'de-ch': de,
    pl,
};

export const getLocale = (language: Language): Locale => localesMap[language] || enUS;

export const localizeMonthsCreator = (getLocale: (language: Language) => Locale) => (
    month: Date,
    language: Language,
): string => {
    const locale = getLocale(language);
    const months = [];
    for (let i = 0; i < 12; i++) {
        months.push(locale.localize?.month(i));
    }
    return months[month.getMonth()];
};

export const localizeWeekDaysCreator = (getLocale: (language: Language) => Locale) => (
    width: 'short' | 'wide',
): ((weekday: number, language: Language) => string) => {
    return (weekday: number, language: Language): string => {
        const locale = getLocale(language);
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(locale.localize?.day(i, { width }));
        }
        return days[weekday];
    };
};

export const getFirstDayWeek = (language: Language): number => (language === 'en' ? 0 : 1);

export const calendarLocaleUtils: LocaleUtils = {
    ...LocaleUtils,
    formatWeekdayLong: localizeWeekDaysCreator(getLocale)('wide'),
    formatWeekdayShort: localizeWeekDaysCreator(getLocale)('short'),
    getFirstDayOfWeek: getFirstDayWeek,
    formatMonthTitle: localizeMonthsCreator(getLocale),
};
