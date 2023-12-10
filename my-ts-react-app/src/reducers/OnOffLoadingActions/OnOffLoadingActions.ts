import { Dispatch } from 'redux';

import { LoadingStatus } from '../../domain/LoadingStatus';
import { RVErrorType, wrapError } from '../../domain/Error';
import { Filters, FilterOption } from '../../domain/Filter';

import { AsyncInjections, DispatchAction, AsyncActionCreator, ActionType } from '../Actions';
import { firstLoadAction } from '../DataActions';
import { MiddlewareExecutor } from '../../middlewares/Entities';

import { Backend, RVUrlParameters } from '../../services';

const makeNewSearch = async (backend: Backend, rateSearchKey: string): Promise<string> => {
    const search = await backend.fetchSearch(rateSearchKey);
    return await backend.startSearch(search);
};

const handleError = (error: unknown, erroType: RVErrorType): DispatchAction => ({
    type: ActionType.LoadedData,
    payload: { loading: LoadingStatus.LOADED_ERROR, error: wrapError(error, erroType) },
});

export const loadDataFromUrl: () => AsyncActionCreator = () => async (
    dispatch: Dispatch<DispatchAction>,
    _: () => void,
    { urlSerializer, browserHistoryService, backend }: AsyncInjections,
): Promise<DispatchAction> => {
    let input: RVUrlParameters;

    try {
        input = urlSerializer.deserialize(...browserHistoryService.getUrlParameters());
    } catch (error) {
        return handleError(error, RVErrorType.UNEXPECTED_MAPPING_SCENARIO);
    }

    if (input.makeNewSearch) {
        try {
            input = { ...input, rateSearchKey: await makeNewSearch(backend, input.rateSearchKey) };
        } catch (error) {
            return dispatch(handleError(error, RVErrorType.UNEXPECTED_SEARCH_START));
        }
    }

    const { rateSearchKey, sort, filters: forceSelection, lastAppliedFilter, currentPage } = input;
    return dispatch(firstLoadAction({ rateSearchKey, sort, forceSelection, lastAppliedFilter, currentPage }));
};

export const reducedToSelectedIds: (filters: Filters) => Map<keyof Filters, string[]> = filters => {
    const selected = new Map<keyof Filters, string[]>();

    for (const filterName in filters) {
        const options: FilterOption<unknown>[] = filters[filterName as keyof Filters];
        const selectedOptions = options.reduce((so: string[], { id, selected }) => (selected ? [...so, id] : so), []);
        selected.set(filterName as keyof Filters, selectedOptions);
    }

    return selected;
};

export const offLoadToUrl: MiddlewareExecutor = ({ store, injections: { urlSerializer, browserHistoryService } }) => {
    const { rateSearchKey, currentPage, sort, filters, lastAppliedFilter } = store.getState();

    if (rateSearchKey) {
        const input: RVUrlParameters = {
            rateSearchKey,
            currentPage,
            sort,
            filters: reducedToSelectedIds(filters),
            lastAppliedFilter,
            makeNewSearch: false,
        };
        browserHistoryService.push(...urlSerializer.serialize(input));
    }
};
