import { MiddlewareExecutor } from '../middlewares/Entities';
import { RVError, RVErrorType } from '../domain/Error';

export const logError: MiddlewareExecutor = ({ store, injections: { loggerService } }) => {
    const { error } = store.getState();

    if (!error) {
        // Not expected scenario
        return;
    }

    loggerService.error(error);
};

const MINIMUM_HANG_UP = 500;

export const warnHangUps: MiddlewareExecutor = ({
    store: { getState },
    action,
    injections: { loggerService },
    duration,
}): void => {
    const {
        staticConfiguration: { environment },
    } = getState();

    if (duration < MINIMUM_HANG_UP) {
        return;
    }

    if (environment === 'production') {
        loggerService.error(
            new RVError(RVErrorType.SLOW_RENDER, `The action took took much time to re-render`, {
                actionType: action.type,
                timeDiff: duration,
            }),
        );
    } else {
        loggerService.log('The action took much time to re-render', { actionType: action.type, timeDiff: duration });
    }
};

export const devLogger: MiddlewareExecutor = ({
    store: { getState },
    action,
    injections: { isDebugging },
    duration,
}): void => {
    const {
        staticConfiguration: { environment },
    } = getState();

    if (environment !== 'production' || isDebugging) {
        console.debug(`Action '${action.type}' was applied after ${duration}ms`);
    }
};

export const updateLogger: MiddlewareExecutor = ({ store: { getState }, injections: { loggerService } }): void => {
    const { rateSearchKey } = getState();

    if (rateSearchKey) {
        loggerService.setRateSearchKey(rateSearchKey);
    }
};
