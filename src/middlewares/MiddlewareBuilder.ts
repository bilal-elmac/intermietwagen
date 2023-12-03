import { Dispatch, MiddlewareAPI } from 'redux';

import { AppState } from '../domain/AppState';

import { AsyncInjections, DispatchAction } from '../reducers/Actions';
import { Evaluator, MiddlewareExecutor, HCMiddleware } from './Entities';

const withDuration = <R>(fn: () => R): [R, number] => {
    const start = Date.now();
    const response = fn();
    return [response, Date.now() - start];
};

class MiddlewareBuilder {
    private injections: AsyncInjections;
    private evaluator: Evaluator;

    constructor(injections: AsyncInjections) {
        this.injections = injections;
        this.evaluator = (): boolean => true;
    }

    when(evaluator: Evaluator): this {
        this.evaluator = evaluator;
        return this;
    }

    then(executor: MiddlewareExecutor, isAsync?: boolean): HCMiddleware {
        return (store: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch<DispatchAction>) => (
            action: DispatchAction,
        ): DispatchAction => {
            const previousState = store.getState();
            const [nextAction, duration] = withDuration(() => next(action));

            if (this.evaluator(action)) {
                const args = { previousState, action, store, injections: this.injections, duration };

                if (isAsync) {
                    setTimeout(() => {
                        executor(args);
                    }, 0);
                } else {
                    executor(args);
                }
            }

            return nextAction;
        };
    }
}

export const byActionType = (...types: DispatchAction['type'][]): Evaluator => {
    const matches = new Set(types);
    return (action): boolean => matches.has(action.type);
};

export const createMiddleware = (injections: AsyncInjections): MiddlewareBuilder => new MiddlewareBuilder(injections);
