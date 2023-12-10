import { Action, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../domain/AppState';

import { Services } from '../services';

export enum ActionType {
    LoadedAutoCompleteSuggestions = 'LoadedSuggestions',
    LoadingData = 'LoadingData',
    LoadedData = 'LoadedData',
    UpdateFilters = 'UpdateFilters',
    DataExpired = 'DataExpired',
    UpdateBanners = 'UpdateBanners',
    Terms = 'Terms',
    MapToggled = 'MapToggled',
    NewSearch = 'NewSearch',
    FirstLoad = 'FirstLoad',
    GaveUpLoading = 'GaveUpLoading',
}

export interface DispatchAction extends Action<ActionType> {
    readonly payload: Partial<AppState>;
}

export type ActionDispatcher = Dispatch<DispatchAction>;

export type AsyncInjections = Pick<
    Services,
    | 'configuration'
    | 'isDebugging'
    | 'backend'
    | 'urlSerializer'
    | 'autocomplete'
    | 'translationService'
    | 'analyticsService'
    | 'loggerService'
    | 'bannersPersistence'
    | 'trackingService'
    | 'browserHistoryService'
>;

type BaseActionCreator<D> = ThunkAction<
    // The type of the last action to be dispatched - will always be DispatchAction for non-async actions
    D,
    // The type for the data within the last action
    AppState,
    // The type of the parameter for the nested function
    AsyncInjections,
    // The type of the last action to be dispatched
    DispatchAction
>;

export type AsyncActionCreator = BaseActionCreator<Promise<DispatchAction>>;
export type ActionCreator = BaseActionCreator<DispatchAction>;

type ReduxDispatch = ThunkDispatch<AppState, AsyncInjections, DispatchAction>;

export const useReduxDispatch = (): ReduxDispatch => useDispatch<ReduxDispatch>();
export const useReduxState = <T>(select: (s: AppState) => T, comparator?: (left: T, right: T) => boolean): T =>
    useSelector((s: AppState) => select(s), comparator);
