import React from 'react';

import { Indexed } from '../../utils/TypeUtils';

import { NameTranslationService } from '../../services/NameTranslation';

type Dispatch = (action: Action) => void;
type State = { readonly airportNames: Indexed<string | null>; readonly translationService: NameTranslationService };
type ProviderProps = { readonly children: React.ReactNode; readonly translationService: NameTranslationService };

const NamesContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

type Action = { type: 'STORE_AIRPORT_NAME'; iata: string; airportName: string | null };

const airportNamesReducer = ({ airportNames, ...state }: State, action: Action): State => {
    switch (action.type) {
        case 'STORE_AIRPORT_NAME':
            return { ...state, airportNames: { ...airportNames, [action.iata]: action.airportName } };
    }
};

const AirportNamesProvider = ({ children, translationService }: ProviderProps): JSX.Element => {
    const [state, dispatch] = React.useReducer(airportNamesReducer, { translationService, airportNames: {} });

    return (
        <NamesContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </NamesContext.Provider>
    );
};

const hasRequestAirportName = (state: State, iata: string): boolean => state.airportNames[iata] !== undefined;
const hasFoundAirportName = (state: State, iata: string): boolean => Boolean(state.airportNames[iata]);

/**
 * Known issues, this hook has some useless renders
 * Whenever a airport name is REQUEST or FOUND it will execute a new render
 */
const useAirportName = (iata: string): string | null => {
    const state = React.useContext(NamesContext);
    const dispatch = React.useContext(DispatchContext);

    if (state === undefined || dispatch === undefined) {
        throw new Error('useAirportName must be used within an AirportNamesProvider');
    }

    setTimeout(() => {
        if (!hasRequestAirportName(state, iata) && !hasFoundAirportName(state, iata)) {
            // Null airport name is dispatched here so it doesn't get dispatched again
            dispatch({ type: 'STORE_AIRPORT_NAME', airportName: null, iata });

            state.translationService.fetchAirportName(iata).then(airportName => {
                if (airportName && !hasFoundAirportName(state, iata)) {
                    dispatch({ type: 'STORE_AIRPORT_NAME', airportName, iata });
                }
            });
        }
    }, 0);

    return state.airportNames[iata] || null;
};

export { AirportNamesProvider, useAirportName };
