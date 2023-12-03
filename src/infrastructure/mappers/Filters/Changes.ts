import { Filters, FilterOption } from '../../../domain/Filter';
import { Price, PriceRange } from '../../../domain/Price';

import { FilterMapper, RequiredFilterResponse, FilterOptionValue, FilterStrategy } from './Mapper';
import { createPrice, mapLowestPrice } from '../Price';

const indexResponse = <R extends RequiredFilterResponse, I, V extends FilterOptionValue<F>, F extends keyof Filters>(
    response: R[],
    mapper: FilterMapper<R, I, V, F>,
): [Map<string, number>, Map<string, boolean>] => {
    // Index changes in price/availability/selection
    const [indexedPrices, indexedSelection] = response.reduce<ReturnType<typeof indexResponse>>(
        ([indexedPrices, indexedSelection], { minprice, selected, ...change }) => {
            const id = mapper.mapResponseToId(change);
            if (!id) {
                return [indexedPrices, indexedSelection];
            }

            return [
                indexedPrices.set(id, mapLowestPrice(indexedPrices.get(id), minprice)),
                indexedSelection.set(id, selected === true),
            ];
        },
        [new Map(), new Map()],
    );
    return [indexedPrices, indexedSelection];
};

const indexSelection = <V extends FilterOptionValue<F>, F extends keyof Filters>(
    selection: FilterOption<V>[],
): [Map<string, boolean | null>, Map<string, boolean>, Map<string, Price | null>] =>
    selection.reduce<ReturnType<typeof indexSelection>>(
        ([indexedSelection, indexedDisabled, wasPriceIndex], o) => [
            indexedSelection.set(o.id, o.selected),
            indexedDisabled.set(o.id, o.disabled),
            wasPriceIndex.set(o.id, o.prices[0]),
        ],
        [new Map(), new Map(), new Map()],
    );

const isOptionSelected = (
    wasSelected: boolean | null | undefined,
    responseSelection: boolean | undefined,
    defaultSelection: boolean | null,
): boolean | null => {
    /**
     * User decided to selected something?
     */
    if (wasSelected === true || wasSelected === false) {
        /**
         * Great, use it
         */
        return wasSelected;
    }

    /**
     * Response is telling us something is selected?
     */
    if (responseSelection === true) {
        /**
         * Great, use it
         */
        return responseSelection;
    }

    /**
     * Default to baseline
     */
    return defaultSelection;
};

const mapMinPrice = (pricesResponse: Map<string, number>, id: string, currencyCode: string): Price | null => {
    const value = pricesResponse.get(id) || 0;
    return value ? createPrice({ currencyCode, value }) : null;
};

export const mergeChanges = <
    R extends RequiredFilterResponse,
    I,
    V extends FilterOptionValue<F>,
    F extends keyof Filters
>({
    response,
    selection,
    baseline,
    lastApplied,

    mapper,

    currencyCode,
}: {
    response: R[];
    selection: FilterOption<V>[];
    baseline: FilterOption<V>[];

    lastApplied: Set<keyof Filters>;

    mapper: FilterMapper<R, I, V, F>;

    currencyCode: string;
}): FilterOption<V>[] => {
    /**
     * The newest response
     */
    const [pricesResponse, selectionResponse] = indexResponse(response, mapper);

    /**
     * What the user had previously selected/had seen as disabled
     */
    const [wasSelectedIndex, wasDisabledIndex, wasPriceIndex] = indexSelection(selection);

    const isLastApplied = lastApplied.has(mapper.filterName);
    const filterStrategy = mapper.type;

    return baseline.map(({ id, selected, disabled, ...option }) => {
        selected = isOptionSelected(wasSelectedIndex.get(id), selectionResponse.get(id), selected);
        let minPrice = mapMinPrice(pricesResponse, id, currencyCode);
        const wasDisabled = wasDisabledIndex.get(id);
        /**
         *  ----------------------------------------
         *  |             | OR          | AND      |
         *  ----------------------------------------
         *  |last applied | not disable | disable  |
         *  ----------------------------------------
         *  |others       | disable     | disable  |
         *  ----------------------------------------
         */
        if (isLastApplied && wasDisabled === false && filterStrategy === FilterStrategy.OR) {
            /**
             * If it is the last that is being applied, it was not disabled before and the filter strategy is OR
             *
             * Than we keep it as it was before (price and disabled status), the user can keep using this filter until it decides to use another one
             */
            disabled = wasDisabled;
            minPrice = wasPriceIndex.get(id) || null;
        } else {
            /**
             * If we don't have a price, the option is now disabled
             */
            disabled = minPrice === null;
        }

        /**
         * If the option is selected, and even if it is disabled, you still allow the user to de-select it
         */
        if (selected && disabled) {
            disabled = false;
        }

        return {
            ...option,
            id,
            selected,
            prices: [disabled ? null : minPrice, null] as PriceRange,
            disabled,
        };
    });
};
