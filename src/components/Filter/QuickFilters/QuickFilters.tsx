import React, { useEffect, useState } from 'react';

import { hasSelectedPackage } from '../../../domain/Filter';

import { useReduxState } from '../../../reducers/Actions';

import { Title } from './Title';
import { CovidSection } from './CovidSection';
import { PackagesFilter } from './Packages/Packages';
import { CarCategoryFilter } from './CarCategories';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';
import { useScrollPointFocus, ScrollMarks } from '../../../state/Scrolling.context';

const BASE_CLASS = 'hc-results-view__quick-filters';

export interface QuickFiltersProps {
    readonly bottom?: boolean;
    readonly isCollapsed: boolean;
    readonly showCovidBanner?: boolean;
    readonly showCarCategoryFilter?: boolean;
    readonly showPackagesFilter: boolean;
}

export const QuickFilters = ({
    showCarCategoryFilter,
    showCovidBanner,
    showPackagesFilter,
    bottom,
    isCollapsed,
}: QuickFiltersProps): JSX.Element | null => {
    const selected = useReduxState(s => hasSelectedPackage(s.filters));
    const [isChecked, setIsChecked] = useState(selected || isCollapsed);
    const order = useReduxState(s => (bottom ? s.offers.standard.length + 1 : undefined));
    const isDesktop = !isTabletOrSmaller();
    const updateCarouselRef = useScrollPointFocus(ScrollMarks.CAR_TYPE_QUICK_FILTER);

    useEffect(() => {
        if (!selected) {
            setIsChecked(isCollapsed);
        }
    }, [isCollapsed, selected]);

    if (!showCarCategoryFilter && !showPackagesFilter) {
        return null;
    }

    return (
        <div className={BASE_CLASS} style={{ order }}>
            {isDesktop && (
                <Title
                    className={BASE_CLASS}
                    showArrow={Boolean(showPackagesFilter)}
                    checked={isChecked}
                    onArrowClick={(): void => setIsChecked(!isChecked)}
                />
            )}
            {showCovidBanner && <CovidSection className={BASE_CLASS} />}
            {showPackagesFilter && (
                <PackagesFilter
                    className={BASE_CLASS}
                    bottom={Boolean(bottom)}
                    checked={isChecked}
                    onChange={(selected): void => {
                        setIsChecked(selected);
                        updateCarouselRef(selected);
                    }}
                />
            )}
            {showCarCategoryFilter && <CarCategoryFilter className={BASE_CLASS} />}
        </div>
    );
};
