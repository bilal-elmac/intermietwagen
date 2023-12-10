import { NavigationContextState } from './Navigation.context';
import { DatePickerContextState } from './DatePicker.context';

import { SearchParameters } from '../domain/SearchParameters';

export const createNewSearchArgs = (
    { pickupSelection: pickUp, dropoffSelection, isOneWay, ageSelection }: NavigationContextState,
    { submittedSelection: { start: pickUpDate, end: dropOffDate } }: DatePickerContextState,
): SearchParameters | null => {
    const dropOff = isOneWay ? dropoffSelection : pickUp;

    if (pickUp && dropOff && ageSelection && pickUpDate && dropOffDate) {
        return {
            pickUp: { locationName: pickUp.name, time: pickUpDate, suggestion: pickUp },
            dropOff: { locationName: dropOff.name, time: dropOffDate, suggestion: dropOff },
            age: ageSelection,
            isOneWay: Boolean(isOneWay),
        };
    }

    return null;
};
