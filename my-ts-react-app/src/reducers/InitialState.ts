import { AppState } from '../domain/AppState';
import { LoadingStatus } from '../domain/LoadingStatus';
import { SortStatus } from '../domain/SortStatus';
import { Filters } from '../domain/Filter';

export const INITIAL_PAGE = 1;
export const INITIAL_SORT = SortStatus.PRICE_ASC;

export const initialFilters: Filters = {
    packages: [],
    vehicleCategories: [],
    pickUpStations: [],
    dropOffStations: [],
    insurances: [],
    airports: [],
    pickupTypes: [],
    neighborhoods: [],
    seats: [],
    features: [],
    paymentMethods: [],
    suppliers: [],
    providers: [],
};

export const initialState: Omit<AppState, 'staticConfiguration'> = {
    rateSearchKey: null,
    loadedTimes: 0,
    loading: LoadingStatus.LOADING_BY_USER,
    loadedPercentage: null,
    error: null,
    currentPage: INITIAL_PAGE,
    sort: INITIAL_SORT,
    totalPages: null,
    staleBy: null,
    search: null,
    requestId: null,

    isMapOpen: null,
    loadMapData: false,

    filters: initialFilters,
    lastAppliedFilter: null,
    forceSelection: null,

    banners: {
        adsBanner: true,
        premiumPackageFilterBanner: true,
        covidBanner: true,
        mapOffersUpdated: true,
    },
    adBannerType: null,

    offers: {
        sortableBy: null,
        totalOffersCount: null,
        offersPerPage: 20,
        prices: [null, null],
        standard: [],
    },

    terms: {},

    dynamicConfiguration: null,

    autoComplete: {
        searchedTerm: '',
        suggestions: [],
        error: null,
    },

    loadedBuffer: null,
};
