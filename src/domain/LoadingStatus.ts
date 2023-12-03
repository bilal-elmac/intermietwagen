export enum LoadingStatus {
    /**
     * Data is loading because a user requested it
     */
    LOADING_BY_USER = 1,
    LOADING_FOR_MAP = 2,
    LOADING_AUTOMATICALLY = 3,

    /**
     * Data loaded
     */
    LOADED_SUCCESS = 4,
    LOADED_ERROR = 5,

    /**
     * Rates have become stale
     */
    EXPIRED = 6,
}

export const isLoading = (loading: LoadingStatus): boolean => loading === LoadingStatus.LOADING_BY_USER;
export const isExpired = (loading: LoadingStatus): boolean => loading === LoadingStatus.EXPIRED;
export const isLoaded = (loading: LoadingStatus): boolean => loading === LoadingStatus.LOADED_SUCCESS;
export const hasError = (loading: LoadingStatus): boolean => loading === LoadingStatus.LOADED_ERROR;
