import React, { useEffect } from 'react';

import { AutocompleteSuggestion } from '../domain/Autocomplete';
import { Age } from '../domain/Configuration';
import { useReduxState } from '../reducers/Actions';
import { Mutable } from '../utils/TypeUtils';

export interface NavigationContextState {
    readonly isOpen: boolean;
    readonly isHelpOpen: boolean;
    readonly isMobileFiltersOpen: boolean;
    readonly ageSelection: Age | null;
    readonly isOneWay: boolean | null;
    readonly pickupSelection: AutocompleteSuggestion | null;
    readonly dropoffSelection: AutocompleteSuggestion | null;
}

const NavigationContextInitialState: NavigationContextState = {
    isOpen: false,
    isHelpOpen: false,
    ageSelection: null,
    isOneWay: null,
    pickupSelection: null,
    dropoffSelection: null,
    isMobileFiltersOpen: false,
};

type Action =
    | { type: 'SET_OVERLAY_VISIBILITY'; payload: boolean }
    | { type: 'SET_PICKUP_SELECTION'; payload: AutocompleteSuggestion | null }
    | { type: 'SET_DROPOFF_SELECTION'; payload: AutocompleteSuggestion | null }
    | { type: 'SET_SELECTED_AGE'; payload: Age }
    | { type: 'SET_RETURN_SELECTION'; payload: boolean }
    | { type: 'SET_HELP_VISIBILITY'; payload: boolean }
    | { type: 'SET_MOBILE_FILTERS_VISIBILITY'; payload: boolean };

type Dispatch = (action: Action) => void;
type NavigationProviderProps = { children: React.ReactNode };

const NavigationStateContext = React.createContext<NavigationContextState>(NavigationContextInitialState);
const NavigationDispatchContext = React.createContext<Dispatch | undefined>(undefined);

function navigationReducer(state: NavigationContextState, action: Action): NavigationContextState {
    switch (action.type) {
        case 'SET_OVERLAY_VISIBILITY': {
            return {
                ...state,
                isOpen: action.payload,
                // if we change overlay state, means we open smth else or should close everything
                isHelpOpen: false,
            };
        }
        case 'SET_SELECTED_AGE': {
            return {
                ...state,
                ageSelection: action.payload,
            };
        }
        case 'SET_RETURN_SELECTION': {
            return {
                ...state,
                isOneWay: action.payload,
            };
        }
        case 'SET_PICKUP_SELECTION': {
            return {
                ...state,
                pickupSelection: action.payload,
            };
        }
        case 'SET_DROPOFF_SELECTION': {
            return {
                ...state,
                dropoffSelection: action.payload,
            };
        }
        case 'SET_HELP_VISIBILITY': {
            return {
                ...state,
                isOpen: action.payload,
                isHelpOpen: action.payload,
            };
        }
        case 'SET_MOBILE_FILTERS_VISIBILITY': {
            return {
                ...state,
                isMobileFiltersOpen: action.payload,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action}`);
        }
    }
}

const overrideWithAppState = (state: Mutable<NavigationContextState>): NavigationContextState => {
    const search = useReduxState(s => s.search);
    const dynamicConfiguration = useReduxState(s => s.dynamicConfiguration);

    if (search) {
        state = {
            ...state,
            isOneWay: state.isOneWay === null ? search.isOneWay : state.isOneWay,
            pickupSelection: state.pickupSelection === null ? search.pickUp.suggestion : state.pickupSelection,
            dropoffSelection: state.dropoffSelection === null ? search.dropOff.suggestion : state.dropoffSelection,
            ageSelection: state.ageSelection || search.age,
        };
    }

    if (dynamicConfiguration && state.ageSelection === null) {
        state.ageSelection = dynamicConfiguration.initialRentalAge;
    }

    return state;
};

function NavigationProvider({ children }: NavigationProviderProps): JSX.Element {
    const [state, dispatch] = React.useReducer(navigationReducer, NavigationContextInitialState);
    const overwriten = overrideWithAppState({ ...state });

    /**
     * Update inner state if context is changed outside
     */
    useEffect(() => {
        if (overwriten.ageSelection) {
            dispatch({
                type: 'SET_SELECTED_AGE',
                payload: overwriten.ageSelection,
            });
        }
    }, [overwriten.ageSelection]);

    return (
        <NavigationStateContext.Provider value={overrideWithAppState({ ...state })}>
            <NavigationDispatchContext.Provider value={dispatch}>{children}</NavigationDispatchContext.Provider>
        </NavigationStateContext.Provider>
    );
}

function useNavigationState(): NavigationContextState {
    const context = React.useContext(NavigationStateContext);
    if (context === undefined) {
        throw new Error('useNavigationState must be used within a NavigationProvider');
    }
    return context;
}

function useNavigationDispatch(): Dispatch {
    const context = React.useContext(NavigationDispatchContext);
    if (context === undefined) {
        throw new Error('useNavigationDispatch must be used within a NavigationProvider');
    }
    return context;
}

function useNavigation(): [NavigationContextState, Dispatch] {
    return [useNavigationState(), useNavigationDispatch()];
}

export { NavigationProvider, useNavigation };
