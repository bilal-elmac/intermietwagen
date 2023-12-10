import { hasError, isExpired, isLoading, LoadingStatus } from './LoadingStatus';
import { DynamicConfiguration, StaticConfiguration } from './Configuration';
import { SearchParameters } from './SearchParameters';
import { Offer } from './Offer';
import { Banners, AdBannerType } from './AdBanner';
import { Filters, hasSelectedFilters } from './Filter';
import { SortStatus } from './SortStatus';
import { PriceRange } from './Price';
import { RVError } from './Error';
import { AutocompleteSuggestion } from './Autocomplete';

export interface AutoCompleteData {
    readonly searchedTerm: string;
    readonly suggestions: AutocompleteSuggestion[];
    readonly error: RVError | null;
}

export interface AppState {
    readonly rateSearchKey: string | null;

    /**
     * Control variables
     */
    // How many times the data was loaded
    readonly loadedTimes: number;
    readonly loading: LoadingStatus;
    readonly error: RVError | null;
    readonly staleBy: Date | null;
    readonly totalPages: number | null;
    readonly loadedPercentage: number | null;

    /**
     * null -> user hasn't decided if the map should be open
     * true | false -> A decision has been made, and needs to be respected
     */
    readonly isMapOpen: boolean | null;
    /**
     * Used to control if the app should request map data from the backend
     */
    readonly loadMapData: boolean;

    readonly sort: SortStatus;
    readonly currentPage: number;
    readonly lastAppliedFilter: keyof Filters | null;
    readonly forceSelection: Map<keyof Filters, string[]> | null;

    // Used to control multiple concurrent requests
    readonly requestId: string | null;

    /**
     * Manage the display of 'About Happy Car' Banner and Packages filters on the result content
     */
    readonly banners: Banners;

    /**
     * Manage the banner type (with or without images)
     */
    readonly adBannerType: AdBannerType | null;

    readonly terms: { [rateId: string]: string | RVError };

    /**
     * General configuration
     */
    readonly dynamicConfiguration: DynamicConfiguration | null;
    readonly staticConfiguration: StaticConfiguration;

    readonly autoComplete: AutoCompleteData;

    /**
     * If new data comes in, and the user did not request it, it will be stored here
     */
    readonly loadedBuffer: Partial<AppState> | null;

    /**
     * Search form
     */
    readonly search: SearchParameters | null;

    /**
     * Filters and packages
     */
    readonly filters: Filters;

    /**
     * All offers
     */
    readonly offers: {
        readonly offersPerPage: number;
        readonly totalOffersCount: number | null;
        readonly sortableBy: SortStatus[] | null;

        readonly prices: PriceRange;
        readonly standard: Offer[];
    };
}

export const hasFinished = (s: Pick<AppState, 'loadedPercentage'>): boolean => s.loadedPercentage === 1;
export const offersAmount = (s: Pick<AppState, 'offers'>): number => s.offers.totalOffersCount || 0;
export const hasOffers = (s: Pick<AppState, 'offers'>): boolean => Boolean(offersAmount(s));
export const hasNoResults = (s: AppState): boolean =>
    !isLoading(s.loading) && !isExpired(s.loading) && !hasOffers(s) && s.loadedTimes > 0;
export const canSort = (s: AppState): boolean => Boolean(s.offers.sortableBy && s.offers.sortableBy.length > 1);
export const willNeverHaveResults = (s: AppState): boolean => hasNoResults(s) && !hasSelectedFilters(s.filters);

export const shouldShowLoadingOfferboxes = (s: AppState): boolean =>
    // Has error and has no offers
    (hasError(s.loading) && !hasOffers(s)) ||
    // Hasn't finished loading and has no offers to show
    (!hasFinished(s) && !hasOffers(s)) ||
    // Is expired but does not have offers to show
    (isExpired(s.loading) && !hasOffers(s)) ||
    // User has requesting new data to be loaded
    isLoading(s.loading);

export const standardOffers = (s: AppState): (Offer | null)[] =>
    !hasNoResults(s)
        ? shouldShowLoadingOfferboxes(s)
            ? Array(s.offers.offersPerPage).fill(null)
            : s.offers.standard
        : [];
