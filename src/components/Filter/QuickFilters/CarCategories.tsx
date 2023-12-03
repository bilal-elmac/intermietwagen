import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { VehicleCategory, FilterOption } from '../../../domain/Filter';
import { CarTypesDetails } from '../../../domain/Configuration';

import { ChecklistFilter } from '../Checklist';
import { CarCategoryIcon } from '../MobileIcons';

import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';
import { updateFilters } from '../../../reducers/FilterActions';
import { useServices } from '../../../state/Services.context';
import {
    registerScrollPoint,
    ScrollMarks,
    useScrollPointFocus,
    useScrollPoints,
} from '../../../state/Scrolling.context';

import IconSeat from '../../../ui/IconSeat';
import IconBag from '../../../ui/IconBag';
import { LogoNoText } from '../../../ui/Logo';

import { useOverrideDisabled } from '../Utilts';
import { sortVehicleCategories } from '../VehicleCategoryUtils';
import { scrollTo } from '../../../utils/ScrollUtils';

const CarTypeInfo: React.FC<{ type: VehicleCategory; typeInfo: CarTypesDetails; className: string }> = ({
    className,
    type,
    typeInfo: { availableSeats, luggage },
}): JSX.Element => (
    <div className="mt-2 flex flex-col h-full">
        <CarCategoryIcon type={type} />
        <footer className={`${className}__type-info`}>
            <ul className="flex w-full justify-around items-center">
                <li data-testid={`${className}__type-info__item`} className={`${className}__type-info__item mr-1`}>
                    <span className={`${className}__type-info__icon--seats`}>
                        <IconSeat />
                    </span>
                    {availableSeats}
                </li>
                {luggage.small || luggage.large ? (
                    <li className={`${className}__type-info__item`}>
                        {luggage.large ? (
                            <>
                                <span className={`${className}__type-info__icon--bag`}>
                                    <IconBag />
                                </span>
                                {luggage.large}
                            </>
                        ) : null}
                        {luggage.small ? (
                            <>
                                <span className={`${className}__type-info__icon--small-bag`}>
                                    <IconBag />
                                </span>
                                {luggage.small}
                            </>
                        ) : null}
                    </li>
                ) : null}
            </ul>
        </footer>
    </div>
);

const CarTypeCarouselHeader = (): JSX.Element => (
    <header className="flex items-center mb-3">
        <LogoNoText />
        <div className="ml-4">
            <h2 className="text-blue text-xl">
                <FormattedMessage id="CONTENT_CATEGORY_FILTER_TITLE" />
            </h2>
            <h3>
                <FormattedMessage id="CONTENT_CATEGORY_FILTER_SUBTITLE" />
            </h3>
        </div>
    </header>
);

export const CarCategoryFilter: React.FC<{ className: string }> = ({ className }): JSX.Element | null => {
    className += '__car-categories-filter';

    const intl = useIntl();
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const carTypesDetails = useReduxState(s => s.dynamicConfiguration?.carTypesDetails);
    const overrideDisabled = useOverrideDisabled();

    // Scrolling refs
    const ref = registerScrollPoint<HTMLDivElement>(ScrollMarks.CAR_TYPE_QUICK_FILTER);
    const updateFirstOfferRef = useScrollPointFocus(ScrollMarks.FIRST_OFFER);
    const carouselRef = useScrollPoints()(ScrollMarks.CAR_TYPE_QUICK_FILTER);
    const updateCarouselRef = useScrollPointFocus(ScrollMarks.CAR_TYPE_QUICK_FILTER);

    // Scroll to car type carousel if requested
    useEffect(() => {
        if (carouselRef?.current && carouselRef?.shouldFocus) {
            scrollTo('toElm', carouselRef.current);
            const timer = setTimeout(() => updateCarouselRef(false), 500);
            return (): void => clearTimeout(timer);
        }
    }, [carouselRef]);

    // filter active and the ones with configuration
    const vehicleCategories = useReduxState(s => s.filters.vehicleCategories).filter(
        item => !item.disabled && carTypesDetails?.find(t => t.carType === item.value),
    );

    if (vehicleCategories.length === 0) {
        return null;
    }

    // render type details as icon for filter option
    const renderTypeDetails = ({ value }: FilterOption<VehicleCategory>): JSX.Element | null => {
        const typeInfo = carTypesDetails?.find(item => item.carType === value);
        if (!typeInfo) {
            return <CarCategoryIcon type={value} />;
        }
        return <CarTypeInfo className={className} type={value} typeInfo={typeInfo} />;
    };

    return (
        <div className={className} ref={ref}>
            <CarTypeCarouselHeader />
            <ChecklistFilter
                options={[
                    {
                        renderLabel: ({ value }): string => intl.formatMessage({ id: `LABEL_CAR_CATEGORY_${value}` }),
                        onChange: (updatedOption): void => {
                            dispatch(updateFilters('vehicleCategories', [updatedOption]));
                            if (updatedOption.selected) {
                                analyticsService.onVehicleCategoriesFilterSelected(updatedOption.value);
                                updateFirstOfferRef(true);
                            }
                        },
                        options: vehicleCategories,
                        renderIcon: renderTypeDetails,
                        sort: ([, { value: a }], [, { value: b }]): number => sortVehicleCategories(a, b),
                        hasIcons: true,
                        overrideDisabled,
                        isHorizontal: true,
                    },
                ]}
            />
        </div>
    );
};
