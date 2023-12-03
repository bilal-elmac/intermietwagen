import axios, { Method, AxiosError } from 'axios';
import queryString from 'qs';

import { RVErrorType, wrapAsyncError, RVError } from '../../domain/Error';
import { Filters, arePartiallyLoaded } from '../../domain/Filter';
import { DynamicConfiguration } from '../../domain/Configuration';
import { Platform } from '../../domain/Platform';
import { SearchParameters } from '../../domain/SearchParameters';

import { formatToTimezonelessDate } from '../../utils/TimeUtils';
import { FirstParameter } from '../../utils/TypeUtils';

import { Backend, RatesFetchArgs, RatesData, LoggerService } from '../../services';

import {
    HCRatesApiResponse,
    HCRatesApiRequest,
    HCRatesSort,
    HCRatesApiConfigurationResponse,
    StartSearchResponse,
    StartSearchRequest,
    TermsResponse,
    HCMapResponse,
} from '../response/HCRatesApiResponse';

import { mapFiltersBaseline, mapFiltersRequest } from '../mappers/Filters';
import { mapResponse, TOTAL_PROGRESS } from '../mappers/Rates';
import { mapDynamicConfiguration } from '../mappers/DynamicConfiguration';
import { mapApiSearchResponse, mapLocation } from '../mappers/Search';

import { Cached } from './Cache';

interface BackendConfiguration {
    readonly platform: Platform;
    readonly ratesApiBaseUrl: string;
    readonly ratesApiKey: string;
    readonly translatedAirportName: string;
}

type RequestConfig<D> = { urlPath: string; method?: Method; error: RVErrorType; data?: D; urlParams?: unknown };
type LoadingFilterConfig = FirstParameter<typeof mapFiltersBaseline> & { loaded: boolean };

export class HCBackend implements Backend {
    private readonly configuration: BackendConfiguration;
    private readonly loggerService: LoggerService;

    private ratesConfiguration = new Cached<HCRatesApiConfigurationResponse>();
    private filtersBaseline = new Cached<Omit<LoadingFilterConfig, 'forceSelection'>>(({ loaded }) => loaded);

    constructor(configuration: BackendConfiguration, loggerService: LoggerService) {
        this.configuration = configuration;
        this.loggerService = loggerService;
    }

    private async request<T, D = unknown>({
        method = 'GET',
        error: errorType,
        urlPath,
        urlParams,
        data,
    }: RequestConfig<D>): Promise<T> {
        return wrapAsyncError(
            async () => {
                const { ratesApiBaseUrl, ratesApiKey } = this.configuration;
                const params = urlParams ? queryString.stringify(urlParams, { encode: false }) : '';
                const response = axios.request<T>({
                    method,
                    url: `${ratesApiBaseUrl}/${urlPath}?${params}`,
                    headers: { 'x-api-key': ratesApiKey },
                    data,
                });

                return (await response).data;
            },
            (e: unknown): RVError | void => {
                const error = e as AxiosError;
                if (error.isAxiosError === true) {
                    return new RVError(errorType, `Error on request: '${error.message}' url: '${error.config.url}'`);
                }
            },
        );
    }

    async loadTerms(rateSearchKey: string, rateId: string): Promise<string> {
        const response = await this.request<TermsResponse>({
            urlPath: `rates/${rateSearchKey}/${rateId}/terms`,
            method: 'GET',
            error: RVErrorType.UNEXPECTED_TERMS_DATA_LOAD,
        });

        const data = response && response.data;
        if (!data || data.constructor !== String) {
            throw new RVError(RVErrorType.UNEXPECTED_MAPPING_SCENARIO, 'Could not load terms response', {
                response,
                rateSearchKey,
                rateId,
            });
        }

        return data;
    }

    private async loadConfiguration(rateSearchKey: string): Promise<HCRatesApiConfigurationResponse> {
        return this.ratesConfiguration.fetchOnce(rateSearchKey, () =>
            this.request({
                urlPath: `search/${rateSearchKey}/configuration`,
                error: RVErrorType.CONFIGURATION_DATA_LOAD,
            }),
        );
    }

    async fetchSearch(rateSearchKey: string): Promise<SearchParameters> {
        const configuration = await this.loadConfiguration(rateSearchKey);

        return mapApiSearchResponse(configuration.search, configuration.rentalAges, {
            translatedAirportName: this.configuration.translatedAirportName,
            loggerService: this.loggerService,
        });
    }

    private loadStations(
        rateSearchKey: string,
        error: RVErrorType,
        urlParams?: Pick<HCRatesApiRequest, 'filter'>,
    ): Promise<HCMapResponse> {
        return this.request<HCMapResponse>({
            urlPath: `search/map/${rateSearchKey}`,
            method: 'GET',
            error,
            urlParams,
        });
    }

    private async loadFiltersConfiguration(
        rateSearchKey: string,
        forceSelection: Map<keyof Filters, string[]> | null,
    ): Promise<Filters> {
        const response = await this.filtersBaseline.fetchOnce(rateSearchKey, async () => {
            const rates = this.loadRates(rateSearchKey, 1, { onlyFilter: true }, RVErrorType.CONFIGURATION_DATA_LOAD);
            const configuration = this.loadConfiguration(rateSearchKey);
            const stations = this.loadStations(rateSearchKey, RVErrorType.CONFIGURATION_DATA_LOAD);

            const {
                filters,
                status: { progress },
            } = await rates;

            return {
                filtersResponse: filters,
                mapResponse: await stations,
                configuration: await configuration,
                // This will force more request if not equal to TOTAL_PROGRESS
                loaded: progress === TOTAL_PROGRESS,
            };
        });

        return mapFiltersBaseline({ ...response, forceSelection });
    }

    private async loadRates(
        rateSearchKey: string,
        page: number,
        urlParams: HCRatesApiRequest,
        error: RVErrorType,
    ): Promise<HCRatesApiResponse> {
        return this.request<HCRatesApiResponse>({ urlPath: `search/rates/${rateSearchKey}/${page}`, error, urlParams });
    }

    async fetchRates({
        rateSearchKey,
        currentPage,
        filters: inboundFilters,
        lastAppliedFilter,
        forceSelection,
        loadMapData,
    }: RatesFetchArgs): Promise<RatesData> {
        const configuration = this.loadConfiguration(rateSearchKey);
        const filtersBaseline = await this.loadFiltersConfiguration(rateSearchKey, forceSelection);

        const userSelection = arePartiallyLoaded(inboundFilters) ? inboundFilters : filtersBaseline;
        const filtersRequest = mapFiltersRequest(userSelection);

        const rates = this.loadRates(
            rateSearchKey,
            currentPage,
            { sort: HCRatesSort.PRICE_ASC, filter: filtersRequest },
            RVErrorType.UNEXPECTED_DATA_LOAD,
        );

        const stations = loadMapData
            ? this.loadStations(rateSearchKey, RVErrorType.UNEXPECTED_DATA_LOAD, { filter: filtersRequest })
            : null;

        return mapResponse({
            // Configuration
            rateSearchKey,
            configuration: await configuration,
            baseUrl: this.configuration.ratesApiBaseUrl,

            // Filters
            filtersBaseline,
            userSelection,
            lastAppliedFilter,

            // Response
            stations: await stations,
            response: await rates,

            loggerService: this.loggerService,
        });
    }

    async fetchConfiguration(rateSearchKey: string): Promise<DynamicConfiguration> {
        return mapDynamicConfiguration(await this.loadConfiguration(rateSearchKey));
    }

    async startSearch({ pickUp, dropOff, age: { id: driverAge } }: SearchParameters): Promise<string> {
        const response = this.request<StartSearchResponse, StartSearchRequest>({
            urlPath: 'search/start',
            method: 'POST',
            error: RVErrorType.UNEXPECTED_SEARCH_START,
            data: {
                platform: this.configuration.platform,
                driverAge: Number(driverAge),
                pickUpLocation: mapLocation(pickUp),
                pickUpDate: formatToTimezonelessDate(pickUp.time),
                dropOffLocation: mapLocation(dropOff),
                dropOffDate: formatToTimezonelessDate(dropOff.time),
            },
        });

        return (await response).key;
    }
}
