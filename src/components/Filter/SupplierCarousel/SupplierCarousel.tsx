import React, { createRef, RefObject, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';
import classNames from 'classnames';

import { Price } from '../../../domain/Price';
import { FilterOption, Highlightable } from '../../../domain/Filter';
import { Supplier } from '../../../domain/Supplier';

import { useServices } from '../../../state/Services.context';

import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';
import { updateFilters } from '../../../reducers/FilterActions';

import PriceLabel from '../../../ui/PriceLabel';
import PulseLoader, { WhitesmokePatch } from '../../../ui/PulseLoader';

import { scrollTo } from '../../../utils/ScrollUtils';
import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';
import { Throttler } from '../../../utils/ThrottleUtils';
import { NullableValue } from '../../../utils/TypeUtils';
import { createKillable } from '../../../utils/ReactUtilts';

const BASE_CLASS = 'hc-results-view__suppliers-carousel';
/**
 * There is a scrolling offset, which I could not track, the code works though
 * TODO Investigate why offset is necessary
 */
const MYSTERIOUS_BORDER_OFFSET = 1;

interface HighlightableSupplier {
    readonly logoUrl: string;
    readonly lowestPrice: Price;
    readonly selected: boolean;

    readonly original: FilterOption<Supplier & Highlightable>;
}

interface EventListeners {
    readonly onClick: () => void;
}

const HighlightedSupplier = ({
    logoUrl,
    lowestPrice,
    selected,
    onClick,
}: HighlightableSupplier & EventListeners): JSX.Element => (
    <li
        className={classNames(`${BASE_CLASS}__list__item`, selected && `${BASE_CLASS}__list__item--selected`)}
        onClick={onClick}
    >
        <img className={`${BASE_CLASS}__list__logo`} src={logoUrl} />
        <p className={`${BASE_CLASS}__list__price`}>
            <FormattedMessage
                id="LABEL_MINIMALIST_PRICE_FROM"
                values={{ price: <PriceLabel {...lowestPrice} alwaysHideDecimals /> }}
            />
        </p>
    </li>
);

type Controls = NullableValue<{
    readonly scrollPrev: VoidFunction;
    readonly scrollNext: VoidFunction;
    readonly scrollable: boolean;
}>;

// TODO Investigate making this hook and exporting generic
const useHorizontalScroll = (ref: RefObject<HTMLElement>): Controls => {
    const NO_CONTROLS: Controls = { scrollPrev: null, scrollNext: null, scrollable: null };

    /**
     * 100ms throttler
     */
    const throttler = useMemo(() => new Throttler(100), []);
    const [controls, setControls] = useState<Controls>(NO_CONTROLS);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        const [updateControls, killUpdate] = createKillable((): void => {
            const scrollable = el.clientWidth < el.scrollWidth;
            const canScrollPrev = scrollable && el.scrollLeft > 0;
            const canScrollNext =
                scrollable && el.scrollWidth - el.scrollLeft - el.clientWidth - MYSTERIOUS_BORDER_OFFSET > 0;

            const scroll = (direction: 1 | -1): void => {
                /**
                 * Disable before scroll
                 */
                setControls({ ...NO_CONTROLS, scrollable });

                /**
                 * This should update the controllers after a couple of seconds, unless the scroll below actually works
                 */
                updateControls();

                /**
                 * Finally scroll
                 */
                scrollTo('horizontal', el, { left: el.scrollLeft + el.clientWidth * direction, behavior: 'smooth' });
            };

            setControls({
                scrollPrev: canScrollPrev ? (): void => scroll(-1) : null,
                scrollNext: canScrollNext ? (): void => scroll(1) : null,
                scrollable,
            });
        });

        /**
         * First calculation
         */
        updateControls();

        /**
         * Setup listener
         */
        const scrollListener = (): void => throttler.run(updateControls);
        el.addEventListener('scroll', scrollListener);

        return (): void => {
            killUpdate();
            el.removeEventListener('scroll', scrollListener);
        };
    }, [ref.current]);

    return controls;
};

const SuppliersList = ({ suppliers }: { suppliers: HighlightableSupplier[] }): JSX.Element => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const isMobile = isTabletOrSmaller();

    const listRef = createRef<HTMLUListElement>();

    const { scrollPrev, scrollNext, scrollable } = useHorizontalScroll(listRef);
    const showArrows = !isMobile && scrollable;

    return (
        <>
            {!isMobile && (
                <p className="suppliers-description">
                    <FormattedMessage id="LABEL_FILTER_POPULAR_SUPPLIERS" />:
                </p>
            )}
            <div className={`${BASE_CLASS}__list__wrapper`}>
                {showArrows && (
                    <ArrowBackIos
                        className={classNames('back-arrow mt-auto mb-auto', !scrollPrev && 'disabled')}
                        onClick={scrollPrev || undefined}
                    />
                )}
                <ul className={`${BASE_CLASS}__list`} ref={listRef}>
                    {suppliers
                        .sort((a, b) => a.lowestPrice.value - b.lowestPrice.value)
                        .map(supplier => (
                            <HighlightedSupplier
                                {...supplier}
                                key={supplier.original.id}
                                onClick={(): void => {
                                    dispatch(
                                        updateFilters('suppliers', [
                                            { ...supplier.original, selected: !supplier.selected },
                                        ]),
                                    );

                                    if (!supplier.selected) {
                                        analyticsService.onSuppliersCarouselSelected(supplier.original.value);
                                    }
                                }}
                            />
                        ))}
                </ul>
                {showArrows && (
                    <ArrowForwardIos
                        className={classNames('forward-arrow mt-auto mb-auto', !scrollNext && 'disabled')}
                        onClick={scrollNext || undefined}
                    />
                )}
            </div>
        </>
    );
};

export const SupplierCarousel = (): JSX.Element => {
    const isLoading = useReduxState(state => state.loadedTimes === 0);
    const suppliers = useReduxState(({ filters: { suppliers } }) =>
        suppliers.reduce<HighlightableSupplier[]>((base, original) => {
            const {
                value: { logoUrl, highlight },
                prices: [lowestPrice],
                selected,
                disabled,
            } = original;

            if (!highlight || !logoUrl || !lowestPrice || disabled) {
                return base;
            }

            return [
                ...base,
                {
                    logoUrl,
                    lowestPrice,
                    selected: selected === true,
                    original,
                },
            ];
        }, []),
    );

    const hasSuppliers = suppliers.length > 0;

    return (
        <div
            className={classNames(
                `${BASE_CLASS} w-full`,
                isLoading && 'text-center',
                (isLoading || hasSuppliers) && `${BASE_CLASS}--enabled`,
            )}
        >
            {isLoading ? (
                <PulseLoader className="h-12 flex">
                    <WhitesmokePatch className="h-full w-6 ml-auto" />
                    <WhitesmokePatch className="h-full w-6 ml-auto" />
                    <WhitesmokePatch className="h-full w-6 ml-auto" />
                    <WhitesmokePatch className="h-full w-6 ml-auto" />
                    <WhitesmokePatch className="h-full w-6 ml-auto" />
                </PulseLoader>
            ) : (
                hasSuppliers && <SuppliersList suppliers={suppliers} />
            )}
        </div>
    );
};
