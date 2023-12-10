import { Filters, FilterOption } from '../../../domain/Filter';

import { FilterResponse } from '../../response/HCRatesApiResponse';
import { Unarray } from '../../../utils/TypeUtils';

export type RequiredFilterResponse = Pick<FilterResponse, 'minprice'> & Partial<FilterResponse>;
type PricelessResponse<R extends RequiredFilterResponse> = Pick<R, Exclude<keyof R, keyof FilterResponse>>;
export enum FilterStrategy {
    OR = 'OR',
    AND = 'AND',
}

/**
 * This constraint ensures a mapper can only map the correct field
 */
export type FilterOptionValue<F extends keyof Filters> = Unarray<Filters[F]>['value'];

export interface FilterMapper<
    R extends RequiredFilterResponse,
    I,
    V extends FilterOptionValue<F>,
    F extends keyof Filters
> {
    mapFilterOptionToRequest(option: FilterOption<V>): I;
    mapResponseToId(response: PricelessResponse<R>): string | null;
    mapResponseToValue(response: PricelessResponse<R>): V | null;
    readonly filterName: F;
    readonly type: FilterStrategy;
}

export const reduceFilterResponse = (a: FilterResponse, b: FilterResponse): FilterResponse => {
    let minPrice = Math.min(a.minprice || Infinity, b.minprice || Infinity);
    minPrice = isFinite(minPrice) ? minPrice : 0;

    return {
        selected: a.selected || b.selected,
        minprice: minPrice,
    };
};
