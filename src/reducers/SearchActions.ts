import { Dispatch } from 'redux';

import { AppState, AutoCompleteData as AutocompleteData } from '../domain/AppState';
import { wrapError, RVErrorType, RVError } from '../domain/Error';
import { SearchParameters } from '../domain/SearchParameters';
import { LoadingStatus } from '../domain/LoadingStatus';

import { ActionType, AsyncInjections, DispatchAction, AsyncActionCreator } from './Actions';
import { initialFilters, initialState } from './InitialState';

// TODO Add test for when you make a new search, and now the search has no offers
// TODO Add test for when you refresh the current search, and now the search has no offers
export const loadAutocompleteData: (searchedTerm: string) => AsyncActionCreator = searchedTerm => async (
    dispatch: Dispatch<DispatchAction>,
    _: () => AppState,
    { autocomplete }: AsyncInjections,
): Promise<DispatchAction> => {
    let data: AutocompleteData;

    try {
        const suggestions = searchedTerm ? await autocomplete.fetchSuggestions(searchedTerm) : [];
        data = { searchedTerm, suggestions, error: null };
    } catch (error) {
        data = {
            searchedTerm,
            suggestions: [],
            error: wrapError(error, RVErrorType.UNEXPECTED_AUTOCOMPLETE_DATA_LOAD),
        };
    }

    return dispatch({
        type: ActionType.LoadedAutoCompleteSuggestions,
        payload: {
            autoComplete: data,
        },
    });
};

const makeNewSearch: (newSearch?: SearchParameters) => AsyncActionCreator = newSearch => async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    { backend }: AsyncInjections,
): Promise<DispatchAction> => {
    let { error, rateSearchKey, loading, filters, search } = getState();
    filters = initialFilters;

    // Override with the custom search parameter
    search = newSearch ? newSearch : search;

    try {
        if (!search) {
            throw new RVError(RVErrorType.UNEXPECTED_STATE, 'Search object not loaded');
        }

        rateSearchKey = await backend.startSearch(search);
        loading = initialState.loading;
        error = null;
    } catch (e) {
        rateSearchKey = null;
        error = wrapError(e, RVErrorType.UNEXPECTED_SEARCH_START);
        loading = LoadingStatus.LOADED_ERROR;
    }

    return dispatch({
        type: ActionType.NewSearch,
        payload: {
            ...initialState,
            search,
            rateSearchKey,
            loading,
            error,
            filters,
        },
    });
};

export const startNewSearch: (search: SearchParameters) => AsyncActionCreator = search => async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    injections: AsyncInjections,
): Promise<DispatchAction> => makeNewSearch(search)(dispatch, getState, injections);

export const restartSearch: () => AsyncActionCreator = () => async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    injections: AsyncInjections,
): Promise<DispatchAction> => makeNewSearch()(dispatch, getState, injections);
