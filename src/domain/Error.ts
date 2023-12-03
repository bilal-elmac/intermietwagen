import { Indexed } from '../utils/TypeUtils';

export enum RVErrorType {
    CURRENCIES_MISSMATCH = 'CURRENCIES_MISSMATCH',
    UNEXPECTED_MAPPING_SCENARIO = 'UNEXPECTED_MAPPING_SCENARIO',
    UNEXPECTED_DATA_LOAD = 'UNEXPECTED_DATA_LOAD',
    UNEXPECTED_AUTOCOMPLETE_DATA_LOAD = 'UNEXPECTED_AUTOCOMPLETE_DATA_LOAD',
    UNEXPECTED_TERMS_DATA_LOAD = 'UNEXPECTED_TERMS_DATA_LOAD',
    CONFIGURATION_DATA_LOAD = 'CONFIGURATION_DATA_LOAD',
    UNEXPECTED_SEARCH_START = 'UNEXPECTED_SEARCH_START',
    UNEXPECTED_STATE = 'UNEXPECTED_STATE',
    UNEXPECTED_PERSISTED_DATA = 'UNEXPECTED_PERSISTED_DATA',
    SLOW_RENDER = 'SLOW_RENDER',
    UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

export class RVError extends Error {
    readonly type: RVErrorType;
    readonly extraInfo?: unknown;

    constructor(type: RVErrorType, message?: string, extraInfo?: Indexed<unknown> | unknown[]) {
        super(message);
        this.type = type;

        if (arguments.length === 3) {
            this.extraInfo = extraInfo;
        }

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const isRVError = (e: unknown): e is RVError => e instanceof RVError;

export const wrapError = (error: unknown, errorType: RVErrorType): RVError =>
    isRVError(error) ? error : new RVError(errorType, String(error), { error });

export const wrapAsyncError = async <T>(
    loader: () => Promise<T>,
    errorResolverOrType: RVErrorType | ((e: unknown) => RVError | void),
): Promise<T> => {
    try {
        return Promise.resolve(await loader());
    } catch (e) {
        return Promise.reject(
            errorResolverOrType instanceof Function
                ? errorResolverOrType(e) || wrapError(e, RVErrorType.UNEXPECTED_ERROR)
                : wrapError(e, errorResolverOrType),
        );
    }
};
