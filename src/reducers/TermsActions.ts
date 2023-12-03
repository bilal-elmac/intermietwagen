import { Dispatch } from 'redux';

import { AppState } from '../domain/AppState';
import { wrapError, RVErrorType, RVError, isRVError } from '../domain/Error';

import { ActionType, AsyncInjections, DispatchAction, AsyncActionCreator } from './Actions';

export const loadTermsAction: (rateId: string) => AsyncActionCreator = rateId => async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    { backend }: AsyncInjections,
): Promise<DispatchAction> => {
    let response: string | RVError;
    const { rateSearchKey, terms: allTerms } = getState();
    if (!rateSearchKey) {
        throw new RVError(RVErrorType.UNEXPECTED_STATE, 'RateSearchKey should be set');
    }

    try {
        response = allTerms[rateId];
        response = isRVError(response) || !response ? await backend.loadTerms(rateSearchKey, rateId) : response;
    } catch (error) {
        response = wrapError(error, RVErrorType.UNEXPECTED_TERMS_DATA_LOAD);
    }

    const { terms } = getState();

    return dispatch({
        type: ActionType.Terms,
        payload: {
            terms: {
                ...terms,
                // Rate ids should be unique
                [rateId]: response,
            },
        },
    });
};
