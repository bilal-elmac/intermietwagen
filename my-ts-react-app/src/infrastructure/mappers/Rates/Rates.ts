import { Filters } from '../../../domain/Filter';
import { SortStatus } from '../../../domain/SortStatus';

import { RatesData, LoggerService } from '../../../services';

import { HCRatesApiResponse, HCRatesApiConfigurationResponse, HCMapResponse } from '../../response/HCRatesApiResponse';

import { mapOffers } from '../Offer';
import { mapApiFiltersResponse } from '../Filters';

export const TOTAL_PROGRESS = 100;

export const mapResponse = ({
    rateSearchKey,
    configuration,
    lastAppliedFilter,
    filtersBaseline,
    userSelection,
    stations,
    response: {
        pagination: { totalPages, ratesPerPage },
        rates: { totalRates, standard },
        filters: newFilters,
        status: { progress },
    },
    baseUrl,
    loggerService,
}: {
    readonly configuration: HCRatesApiConfigurationResponse;
    readonly response: HCRatesApiResponse;
    readonly stations: HCMapResponse | null;
    readonly rateSearchKey: string;
    readonly lastAppliedFilter: keyof Filters | null;
    readonly filtersBaseline: Filters;
    readonly userSelection: Filters;
    readonly baseUrl: string;
    readonly loggerService: LoggerService;
}): RatesData => {
    // If stations haven't been loaded, just fill in with this replacement
    stations = stations || { cheapestByDropOffBranch: [], cheapestByPickUpBranch: [] };

    const filters = mapApiFiltersResponse({
        lastAppliedFilter,
        newFilters: { ...newFilters, ...stations },
        filtersBaseline,
        userSelection,
        configuration,
    });

    const offerConfiguration = { ...configuration, rateSearchKey, baseUrl };

    return {
        staleBy: new Date(configuration.search.expiresAt),
        totalPages,
        loadedPercentage: progress / TOTAL_PROGRESS,
        filters,
        offers: {
            sortableBy: [SortStatus.PRICE_ASC],
            totalOffersCount: totalRates,
            offersPerPage: ratesPerPage,
            prices: [null, null],
            standard: mapOffers(standard, offerConfiguration, loggerService),
        },
    };
};
