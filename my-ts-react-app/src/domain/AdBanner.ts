export interface Banners {
    readonly adsBanner: boolean;
    readonly premiumPackageFilterBanner: boolean;
    readonly covidBanner: boolean;
    readonly mapOffersUpdated: boolean;
}

export enum AdBannerType {
    WITHOUT_GRAPH = 0,
    WITH_GRAPH = 1,
}

export interface PersistedBannerConfig {
    readonly rateSearchKey: string;
    readonly banners: keyof Banners;
}
