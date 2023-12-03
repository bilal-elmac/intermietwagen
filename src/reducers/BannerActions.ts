import { Dispatch } from 'redux';
import { Banners } from '../domain/AdBanner';
import { AppState } from '../domain/AppState';

import { ActionType, DispatchAction, ActionCreator } from './Actions';

export type BannersTypes = keyof Banners;

export const closeBanner: (bannerType: BannersTypes) => ActionCreator = (bannerType: BannersTypes) => (
    dispatch: Dispatch<DispatchAction>,
    getState: () => AppState,
    { bannersPersistence },
): DispatchAction => {
    const { banners, rateSearchKey } = getState();

    if (!rateSearchKey) {
        return dispatch({
            type: ActionType.UpdateBanners,
            payload: {},
        });
    }

    bannersPersistence.persist({ rateSearchKey, banners: bannerType });

    return dispatch({
        type: ActionType.UpdateBanners,
        payload: {
            banners: {
                ...banners,
                [bannerType]: false,
            },
        },
    });
};
