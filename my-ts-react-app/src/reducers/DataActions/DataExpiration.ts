import { LoadingStatus } from '../../domain/LoadingStatus';
import { AppState } from '../../domain/AppState';

import { MiddlewareExecutor, Store } from '../../middlewares/Entities';

import { ActionType } from '../Actions';

const expire = (store: Store, { staleBy, requestId }: Pick<AppState, 'staleBy' | 'requestId'>): void => {
    const { staleBy: newStaleBy, requestId: newRequestId } = store.getState();

    /**
     * Make sure the offers are still stale
     * Make sure that the data being evaluated comes from the same request
     */
    if (newStaleBy === staleBy && requestId === newRequestId) {
        store.dispatch({ type: ActionType.DataExpired, payload: { loading: LoadingStatus.EXPIRED } });
    }
};

export const schedulateDataExpiration: MiddlewareExecutor = ({ store }) => {
    const { staleBy, requestId } = store.getState();

    if (!staleBy) {
        // Offers will never get stale
        return;
    }

    const diff = staleBy.getTime() - Date.now();

    if (diff < 0) {
        expire(store, { staleBy, requestId });
    } else {
        // Wait until its said to be stale
        setTimeout(() => expire(store, { staleBy, requestId }), diff);
    }
};
