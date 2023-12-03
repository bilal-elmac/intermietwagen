import thunkMiddleware from 'redux-thunk';
import {
    createStore as createReducerStore,
    Reducer,
    Store,
    applyMiddleware,
    DeepPartial,
    compose,
    Action,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { AppState } from '../domain/AppState';
import { StaticConfiguration } from '../domain/Configuration';

import { createMiddleware, byActionType } from '../middlewares/MiddlewareBuilder';
import { MiddlewareExecutor, HCMiddleware } from '../middlewares/Entities';

import { DispatchAction, ActionType, AsyncInjections } from './Actions';
import { requestData, schedulateDataExpiration } from './DataActions';
import { logError, warnHangUps, devLogger, updateLogger } from './LoggingActions';
import { offLoadToUrl } from './OnOffLoadingActions';

import { initialState } from './InitialState';

import { isEnumOf } from '../utils/EnumUtils';

const createReducer = (staticConfiguration: StaticConfiguration): Reducer<AppState, DispatchAction> => (
    state: AppState = { ...initialState, staticConfiguration },
    action: DispatchAction | Action<unknown>,
): AppState => (isEnumOf(ActionType, action.type) ? { ...state, ...(action as DispatchAction).payload } : state);

export const createStoreWithMiddlwares = (
    injections: AsyncInjections,
    middlewares: HCMiddleware[],
): Store<AppState, DispatchAction> => {
    const composeEnhancers: (...args: unknown[]) => DeepPartial<AppState> =
        injections.configuration.environment === 'production' ? compose : composeWithDevTools({});

    return createReducerStore<AppState, DispatchAction, AppState, AppState>(
        createReducer(injections.configuration),
        composeEnhancers(applyMiddleware(thunkMiddleware.withExtraArgument(injections), ...middlewares)),
    );
};

export const createStore = (
    injections: AsyncInjections,
    argsListener?: MiddlewareExecutor,
): Store<AppState, DispatchAction> => {
    const middlewares: HCMiddleware[] = [
        createMiddleware(injections)
            .when(
                byActionType(
                    ActionType.FirstLoad,
                    ActionType.UpdateFilters,
                    ActionType.MapToggled,
                    ActionType.NewSearch,
                ),
            )
            .then(requestData),
        createMiddleware(injections)
            .when(byActionType(ActionType.LoadedData))
            .then(offLoadToUrl, true),
        createMiddleware(injections)
            .when(byActionType(ActionType.LoadedData))
            .then(schedulateDataExpiration),
        createMiddleware(injections)
            .when(action => action.type === ActionType.LoadedData && action.payload.loadedTimes === 1)
            .then(() => injections.analyticsService.onFirstDataLoadEvent(), true),
        createMiddleware(injections)
            .when(action => Boolean(action.payload.error))
            .then(logError, true),
        createMiddleware(injections).then(updateLogger),
        createMiddleware(injections).then(warnHangUps, true),
        createMiddleware(injections).then(devLogger, true),
    ];

    if (argsListener) {
        middlewares.push(createMiddleware(injections).then(argsListener));
    }

    return createStoreWithMiddlwares(injections, middlewares);
};
