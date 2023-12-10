import queryString from 'qs';

import { Filters } from '../domain/Filter';
import { SortStatus } from '../domain/SortStatus';
import { RVError, RVErrorType } from '../domain/Error';

import { UrlParametersSerializer, RVUrlParameters } from '../services/UrlServices';

import { INITIAL_PAGE, INITIAL_SORT } from '../reducers/InitialState';
import { isEnumOf } from '../utils/EnumUtils';

type ReducedFilterNames = 'pa' | 'vc' | 'pt' | 'ne' | 'se' | 'pm' | 'su' | 'pr' | 'ai' | 'fe' | 'ps' | 'ds' | 'in';
type UrlParameter = ReducedFilterNames | 'or' | 'lf' | 'mns';

// This record is used to force errors if new filters are added
const filterNamesMap: Record<keyof Filters, ReducedFilterNames> = {
    packages: 'pa',
    insurances: 'in',
    vehicleCategories: 'vc',
    pickupTypes: 'pt',
    neighborhoods: 'ne',
    seats: 'se',
    paymentMethods: 'pm',
    suppliers: 'su',
    providers: 'pr',
    airports: 'ai',
    features: 'fe',
    pickUpStations: 'ps',
    dropOffStations: 'ds',
};

// And this link is used for easy traversal
const filterNamesLink = (Object.entries(filterNamesMap) as unknown) as [keyof Filters, ReducedFilterNames][];

const FILTER_OPTIONS_SEPARATOR = ',';
const PATH_NAME_SEPARATOR = '/';

export class UrlParametersSerializerImpl implements UrlParametersSerializer {
    private readonly publicPath: string;

    constructor(publicPath: string) {
        this.publicPath = publicPath;
    }

    serialize({ rateSearchKey, currentPage, sort, filters, lastAppliedFilter }: RVUrlParameters): [string, string] {
        const plainFilters = new Map<UrlParameter, string>();
        let shortLastAppliedFilter: ReducedFilterNames | null = null;

        // Filters
        filterNamesLink.forEach(([filterName, shortName]) => {
            const selected = filters.get(filterName);
            if (selected && selected.length) {
                plainFilters.set(shortName, selected.join(FILTER_OPTIONS_SEPARATOR));
            }

            if (plainFilters.has(shortName) && lastAppliedFilter === filterName) {
                shortLastAppliedFilter = shortName;
            }
        });

        // Sort
        plainFilters.set('or', String(sort));
        if (shortLastAppliedFilter) {
            plainFilters.set('lf', shortLastAppliedFilter);
        }

        return [
            // rateSearchKey and page
            this.publicPath + rateSearchKey + PATH_NAME_SEPARATOR + currentPage,
            queryString.stringify(Object.fromEntries(plainFilters)),
        ];
    }

    deserialize(...[url, pathname, searchParameters]: [string, string, string]): RVUrlParameters {
        // rateSearchKey and page
        const [rateSearchKey, currentPage] = pathname
            // Removes the public path start
            .substring(this.publicPath.length)
            .split(PATH_NAME_SEPARATOR);
        if (!rateSearchKey) {
            throw new RVError(
                RVErrorType.UNEXPECTED_MAPPING_SCENARIO,
                'No rate search key could be loaded from the url',
                { url },
            );
        }

        // Filters
        const parsedParameters = (new URLSearchParams(searchParameters) as unknown) as Map<UrlParameter, string>;

        const shortNamedLastFilters = (parsedParameters.get('lf') || '').split(FILTER_OPTIONS_SEPARATOR);
        let lastAppliedFilter: keyof Filters | null = null;
        const filters = new Map<keyof Filters, string[]>();

        filterNamesLink.forEach(([filterName, shortName]) => {
            const options = parsedParameters.get(shortName);
            if (options) {
                filters.set(filterName, options.split(FILTER_OPTIONS_SEPARATOR));
            }

            if (shortNamedLastFilters.includes(shortName)) {
                lastAppliedFilter = filterName;
            }
        });

        // Sort
        const sort = Number(parsedParameters.get('or'));

        // If a new search should be made with the current key
        const makeNewSearch = parsedParameters.get('mns') === String(true);

        return {
            currentPage: Number(currentPage) || INITIAL_PAGE,
            sort: isEnumOf(SortStatus, sort) ? sort : INITIAL_SORT,
            rateSearchKey,
            filters,
            lastAppliedFilter,
            makeNewSearch,
        };
    }
}
