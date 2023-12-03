import React, { useReducer, useEffect } from 'react';
import { isBefore } from 'date-fns';

import { Mutable } from '../utils/TypeUtils';

import { useReduxState } from '../reducers/Actions';

interface TimeSpan<S, E> {
    readonly start: S;
    readonly end: E;
}

export interface DatePickerContextState {
    readonly isPickerOpen: boolean;
    readonly isCalendarOpen: boolean;
    readonly submittedSelection: TimeSpan<Date | null, Date | null>;
    readonly unfinishedSelection: TimeSpan<Date, Date | null>;
}

const DatePickerContextInitialState: DatePickerContextState = {
    isCalendarOpen: false,
    isPickerOpen: false,
    submittedSelection: { start: null, end: null },
    unfinishedSelection: { start: new Date(), end: null },
};

type Action =
    | { type: 'SET_OVERLAY_VISIBILITY'; payload: boolean }
    | { type: 'SET_CALENDAR_VISIBILITY'; payload: boolean }
    | { type: 'SET_SELECTIONS'; payload: [Date, Date] }
    | { type: 'SET_SUBMITTED_SELECTION'; payload: [Date | null, Date | null] }
    | { type: 'SET_TEMPORARY_SELECTION'; payload: [Date, Date | null] };

type Dispatch = (action: Action) => void;
type DatePickerProviderProps = { children: React.ReactNode };

const DatePickerStateContext = React.createContext<DatePickerContextState | undefined>(undefined);
const DatePickerDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const datePickerReducer = (state: DatePickerContextState, action: Action): DatePickerContextState => {
    switch (action.type) {
        case 'SET_OVERLAY_VISIBILITY':
            return {
                ...state,
                isPickerOpen: action.payload || state.isCalendarOpen,
            };
        case 'SET_SELECTIONS':
            return {
                ...state,
                submittedSelection: {
                    start: action.payload[0],
                    end: action.payload[1],
                },
                unfinishedSelection: {
                    start: action.payload[0],
                    end: action.payload[1],
                },
            };
        case 'SET_SUBMITTED_SELECTION':
            return {
                ...state,
                submittedSelection: {
                    start: action.payload[0],
                    end: action.payload[1],
                },
            };
        case 'SET_TEMPORARY_SELECTION':
            return {
                ...state,
                unfinishedSelection: {
                    start: action.payload[0],
                    end: action.payload[1],
                },
            };
        case 'SET_CALENDAR_VISIBILITY': {
            // reset calendar state, when close calendar from overlay or search form button with wrong dates
            if (
                state.submittedSelection.end !== null &&
                state.submittedSelection.start !== null &&
                isBefore(state.submittedSelection.end, state.submittedSelection.start) &&
                !action.payload
            ) {
                return {
                    ...state,
                    submittedSelection: DatePickerContextInitialState.submittedSelection,
                    isPickerOpen: action.payload,
                    isCalendarOpen: action.payload,
                };
            } else {
                return {
                    ...state,
                    isPickerOpen: action.payload,
                    isCalendarOpen: action.payload,
                };
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action}`);
        }
    }
};

const overrideWithAppState = (state: Mutable<DatePickerContextState>): DatePickerContextState => {
    const search = useReduxState(s => s.search);

    if (search && search.dropOff && search.pickUp) {
        state.submittedSelection = {
            start: state.submittedSelection.start || search.pickUp.time,
            end: state.submittedSelection.end || search.dropOff.time,
        };
    }

    return state;
};

export const DateProvider = ({ children }: DatePickerProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(datePickerReducer, DatePickerContextInitialState);
    const overwriten = overrideWithAppState({ ...state });

    /**
     * Update inner state if context is changed outside
     */
    useEffect(() => {
        if (overwriten.submittedSelection.start && overwriten.submittedSelection.end) {
            dispatch({
                type: 'SET_SELECTIONS',
                payload: [overwriten.submittedSelection.start, overwriten.submittedSelection.end],
            });
        }
    }, [overwriten.submittedSelection.start, overwriten.submittedSelection.end]);

    return (
        <DatePickerStateContext.Provider value={overwriten}>
            <DatePickerDispatchContext.Provider value={dispatch}>{children}</DatePickerDispatchContext.Provider>
        </DatePickerStateContext.Provider>
    );
};

export const useDatePickerState = (): DatePickerContextState => {
    const context = React.useContext(DatePickerStateContext);
    if (context === undefined) {
        throw new Error('useDatePickerState must be used within a CountProvider');
    }
    return context;
};

export const useDatePickerDispatch = (): Dispatch => {
    const context = React.useContext(DatePickerDispatchContext);
    if (context === undefined) {
        throw new Error('useDatePickerDispatch must be used within a CountProvider');
    }
    return context;
};

export const useDatePicker = (): [DatePickerContextState, Dispatch] => [useDatePickerState(), useDatePickerDispatch()];
