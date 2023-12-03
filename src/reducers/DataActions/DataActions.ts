import { Dispatch } from 'redux';

import { AppState, hasFinished } from '../../domain/AppState';
import { FilterOption, Filters, arePartiallyLoaded, hasSelectedFilters } from '../../domain/Filter';
import { SearchParameters } from '../../domain/SearchParameters';
import { hasError, isExpired, LoadingStatus } from '../../domain/LoadingStatus';
import { AdBannerType, Banners, PersistedBannerConfig } from '../../domain/AdBanner';
import { wrapError, RVErrorType, RVError } from '../../domain/Error';
import { MiddlewareExecutor, Store } from '../../middlewares/Entities';

import { Mutable } from '../../utils/TypeUtils';
import { unique } from '../Utils';

import { INITIAL_PAGE } from '../InitialState';
import { ActionType, AsyncInjections, DispatchAction, AsyncActionCreator, ActionCreator } from '../Actions';

import { RatesFetchArgs, Backend, RatesData, PeristenceService, LoggerService } from '../../services';

type LoadingSource =
    | LoadingStatus.LOADING_AUTOMATICALLY
    | LoadingStatus.LOADING_FOR_MAP
    | LoadingStatus.LOADING_BY_USER;
type DataControlArgs = { readonly loadingSource: LoadingSource; readonly onlyLoadOffersIfFinished?: boolean };
type Args = Pick<RatesFetchArgs, 'rateSearchKey' | 'sort' | 'currentPage'> & DataControlArgs;

const loadBannersConfiguration = (
    bannersPersistence: PeristenceService<string, PersistedBannerConfig>,
    rateSearchKey: string,
    loggerService: LoggerService,
): Partial<Banners> => {
    const newBanners: Partial<Mutable<Banners>> = {};

    try {
        bannersPersistence.findAll(rateSearchKey).forEach(item => {
            newBanners[item.banners] = false;
        });
    } catch (error) {
        loggerService.error(
            new RVError(RVErrorType.UNEXPECTED_PERSISTED_DATA, 'Could not load banner persisted configuration', error),
        );
    }

    return newBanners;
};

/**
 * Updates the state to signal that page is loading
 */
const dispatchLoading = (dispatch: Dispatch<DispatchAction>, loadingSource?: LoadingSource): string => {
    const requestId = unique();

    const payload: Partial<AppState> = {
        error: null,
        loading: loadingSource || LoadingStatus.LOADING_BY_USER,
        loadedBuffer: null,
        requestId,
    };

    dispatch({ type: ActionType.LoadingData, payload: payload });

    return requestId;
};

/**
 * Loads and dispatches configuration
 *
 * @param dispatch
 * @param backend
 * @param rateSearchKey
 *
 * @returns SearchParameters promise
 */
const dispatchSearchMetadata = async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    backend: Backend,
    rateSearchKey: string,
    requestId: AppState['requestId'],
): Promise<SearchParameters | null> => {
    const [dynamicConfiguration, search] = await Promise.all([
        backend.fetchConfiguration(rateSearchKey),
        backend.fetchSearch(rateSearchKey),
    ]);

    const { requestId: currentRequestId } = getState();
    if (requestId === currentRequestId) {
        dispatch({
            type: ActionType.LoadedData,
            payload: {
                /**
                 * Only loading the configuration
                 * even if we don't have offers data
                 */
                dynamicConfiguration,
                search,
            },
        });

        return search;
    }

    return null;
};

/**
 * Generates a hash based on the given offers and filters
 *
 * @param offers
 * @param filters
 */
const getRatesHash = ({ standard }: AppState['offers'], filters: Filters): string | null => {
    // Add offers
    const offersHash = standard.map(({ rateId }) => rateId).sort();

    // Add filters
    const filtersHash = Object.keys(filters).reduce<string[]>((out, filterName) => {
        const options = filters[filterName as keyof Filters] as FilterOption<unknown>[];
        const ids = options.map(({ id }) => id).sort();
        return ids.length ? [...out, filterName + ids.join('-')] : out;
    }, []);

    return [...filtersHash, ...offersHash].join('-');
};

const hasLoaded = ({ standard }: AppState['offers'], filters: Filters): boolean =>
    Boolean(standard.length) && arePartiallyLoaded(filters);

const resolvePayload = (
    loadedState: Partial<AppState> & RatesData,
    previousOffers: AppState['offers'],
    previousFilters: Filters,
    loadingStatus: LoadingStatus | undefined,
): Partial<AppState> => {
    if (
        // User hasn't requested reload
        loadingStatus === LoadingStatus.LOADING_AUTOMATICALLY &&
        // Has loaded offers and filters
        hasLoaded(previousOffers, previousFilters) &&
        // Has different offers or filters
        getRatesHash(previousOffers, previousFilters) !== getRatesHash(loadedState.offers, loadedState.filters)
    ) {
        // Hide new data in the buffer
        return {
            loadedBuffer: loadedState,
            // Signal the page that the results have loaded
            loading: LoadingStatus.LOADED_SUCCESS,
        };
    }

    return loadedState;
};

const resolveSelection = (
    {
        forceSelection,
        filters,
        loadedTimes,
        lastAppliedFilter,
    }: Pick<AppState, 'loadedTimes' | 'filters' | 'forceSelection' | 'lastAppliedFilter'>,
    search: SearchParameters,
): Pick<AppState, 'lastAppliedFilter' | 'forceSelection'> => {
    if (
        /**
         * It is NOT first load
         */
        loadedTimes !== 0 ||
        /**
         * Search is NOT of airport
         */
        search.pickUp.suggestion.type !== 'airport' ||
        !search.pickUp.suggestion.iata ||
        /**
         * User already has a custom url selection
         */
        (forceSelection !== null && forceSelection.size > 0) ||
        /**
         * There are filters selected
         */
        hasSelectedFilters(filters) ||
        lastAppliedFilter
    ) {
        /**
         * It is NOT first load
         */
        return { lastAppliedFilter, forceSelection };
    }

    return {
        forceSelection: new Map([['airports', [search.pickUp.suggestion.iata]]]),
        lastAppliedFilter: 'airports',
    };
};

export const loadDataAction: (args: Args) => AsyncActionCreator = args => async (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    { backend, bannersPersistence, loggerService }: AsyncInjections,
): Promise<DispatchAction> => {
    const requestId = dispatchLoading(dispatch, args.loadingSource);

    try {
        const search = await dispatchSearchMetadata(dispatch, getState, backend, args.rateSearchKey, requestId);

        if (search === null) {
            return dispatch({ type: ActionType.GaveUpLoading, payload: { loading: LoadingStatus.LOADED_SUCCESS } });
        }

        const { rateSearchKey, currentPage, sort, loadingSource } = args;
        const { filters, loadMapData } = getState();
        const { forceSelection, lastAppliedFilter } = resolveSelection(getState(), search);

        const response = await backend.fetchRates({
            rateSearchKey,
            currentPage,
            sort,
            filters,
            forceSelection,
            lastAppliedFilter,
            loadMapData,
        });

        const {
            requestId: currentRequestId,
            loadedTimes,
            offers: previousOffers,
            filters: previousFilters,
            banners,
        } = getState();

        if (
            // This request was not the last request, giving up
            requestId !== currentRequestId ||
            // Do not load rates if they are finished loading
            (args.onlyLoadOffersIfFinished && !hasFinished(response))
        ) {
            return dispatch({
                type: ActionType.GaveUpLoading,
                payload: {
                    loading: LoadingStatus.LOADED_SUCCESS,
                },
            });
        }

        const payload = resolvePayload(
            {
                ...response,

                // If the response has been loaded, it means we can stop forcing selection there was one
                forceSelection: (hasFinished(response) ? null : forceSelection) || null,

                // Parameters/Filters
                rateSearchKey,
                sort,
                lastAppliedFilter,

                // If the new response has valid total pages
                // and the pageCount has decreased, this will handle it
                currentPage: Math.min(response.totalPages || INITIAL_PAGE, currentPage),

                /**
                 * Other control variables
                 */
                loading: LoadingStatus.LOADED_SUCCESS,
                loadedTimes: loadedTimes + 1,

                /**
                 * The first char of the string will be converted to its ascii int code
                 * If even -> without graph
                 * If odd -> with grapth
                 */
                adBannerType: rateSearchKey.charCodeAt(0) % 2 ? AdBannerType.WITHOUT_GRAPH : AdBannerType.WITH_GRAPH,

                // Banners handling, take from local storage
                banners: {
                    ...banners,
                    ...loadBannersConfiguration(bannersPersistence, rateSearchKey, loggerService),
                },

                loadedBuffer: null,
            },
            previousOffers,
            previousFilters,
            loadingSource,
        );

        return dispatch({ type: ActionType.LoadedData, payload });
    } catch (error) {
        return dispatch({
            type: ActionType.GaveUpLoading,
            payload: {
                loading: LoadingStatus.LOADED_ERROR,
                error: wrapError(error, RVErrorType.UNEXPECTED_DATA_LOAD),
            },
        });
    }
};

const scheduleAutomaticReload = (
    store: Store,
    timeout: number,
    loadingSource: LoadingSource,
    onlyLoadOffersIfFinished: boolean,
): void => {
    const { rateSearchKey: oldRateSearchKey } = store.getState();

    setTimeout(() => {
        const { rateSearchKey, sort, currentPage, loading } = store.getState();

        if (!rateSearchKey || oldRateSearchKey !== rateSearchKey || hasError(loading) || isExpired(loading)) {
            /**
             * The search cannot be made if
             * - We don't have a rateSearchKey
             * - Another search was made in between
             * - The data load is not succesfull/expired
             */
            return;
        }

        store.dispatch(
            loadDataAction({
                rateSearchKey,
                sort,
                currentPage,
                loadingSource,
                onlyLoadOffersIfFinished,
            }),
        );
    }, timeout);
};

export const requestData: MiddlewareExecutor = ({
    store,
    previousState: { rateSearchKey: previousRateSearchKey },
    injections: { loggerService },
    action: { type },
}): void => {
    const {
        rateSearchKey,
        sort,
        currentPage,
        staticConfiguration: { loadMoments },
    } = store.getState();

    if (!rateSearchKey) {
        /**
         * Unexpected scenario, the url was not properly formed, so it is not usable
         */
        loggerService.error(
            new RVError(RVErrorType.UNEXPECTED_STATE, 'Request data function was executed without proper parameters', {
                rateSearchKey,
            }),
        );
        return;
    }

    if (previousRateSearchKey !== rateSearchKey) {
        /**
         * If previous rate search key is different from current one, then it is a new search
         *
         * We need to schedule the actual searches
         *
         */
        loadMoments.forEach(moment =>
            scheduleAutomaticReload(
                store,
                moment,
                moment === 0 ? LoadingStatus.LOADING_BY_USER : LoadingStatus.LOADING_AUTOMATICALLY,
                moment === 0,
            ),
        );
    } else {
        /**
         * If it is the same, we can do a search right away
         */
        store.dispatch(
            loadDataAction({
                rateSearchKey,
                sort,
                currentPage,
                loadingSource:
                    type === ActionType.MapToggled ? LoadingStatus.LOADING_FOR_MAP : LoadingStatus.LOADING_BY_USER,
            }),
        );
    }
};

export const loadBufferedData: () => ActionCreator = () => (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
): DispatchAction => {
    const { loadedBuffer } = getState();

    return dispatch({
        type: ActionType.LoadedData,
        payload: loadedBuffer ? { ...loadedBuffer, loadedBuffer: null } : {},
    });
};

export const firstLoadAction = (
    args: Pick<AppState, 'rateSearchKey' | 'sort' | 'forceSelection' | 'lastAppliedFilter' | 'currentPage'>,
): DispatchAction => ({
    type: ActionType.FirstLoad,
    payload: {
        ...args,
        loading: LoadingStatus.LOADING_BY_USER,
    },
});
