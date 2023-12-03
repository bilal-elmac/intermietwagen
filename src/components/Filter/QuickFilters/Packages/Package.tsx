import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FilterOption, OfferPackage } from '../../../../domain/Filter';
import { Price as PriceModel } from '../../../../domain/Price';

import { Throttler } from '../../../../utils/ThrottleUtils';

import { useServices } from '../../../../state/Services.context';
import { updatePackageFilter } from '../../../../reducers/FilterActions';
import { useReduxDispatch } from '../../../../reducers/Actions';

import PriceLabel from '../../../../ui/PriceLabel';
import IconAvailability, { AvailabilityStatus } from '../../../../ui/IconAvailability';

import { Header } from './Header';
import { Features } from './Features';

const Price: React.FC<{ className: string; price: PriceModel }> = ({ className, price }): JSX.Element => (
    <aside className={`${className}__footer__price`}>
        <FormattedMessage
            id="LABEL_MINIMALIST_PRICE_FROM"
            values={{
                price: (
                    <span className="font-bold text-2xl leading-none md:w-full md:block">
                        <PriceLabel {...price} />
                    </span>
                ),
            }}
        />
    </aside>
);

export const Package: React.FC<{
    className: string;
    packageOffer: FilterOption<OfferPackage>;
    isCollapsed: boolean;
    bottom: boolean;
    onChange: (selected: boolean) => void;
}> = ({ className, packageOffer, isCollapsed, bottom, onChange }): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();

    // TODO Fix double click firing
    const [throtller] = useState(new Throttler(50));

    className += '__list-item';

    return (
        <li
            className={classNames(
                className,
                `${className}--${packageOffer.value.type.toLowerCase()}`,
                packageOffer.disabled && `${className}--disabled`,
            )}
            onClick={(): void => {
                if (packageOffer.disabled) {
                    return;
                }

                throtller.run(() => {
                    const selected = !packageOffer.selected;

                    dispatch(updatePackageFilter({ ...packageOffer, selected }));
                    if (selected) {
                        analyticsService.onPackagesBannerSelected(packageOffer.value.type, bottom ? 'bottom' : 'top');
                    }

                    onChange(selected);
                });
            }}
        >
            <Header {...packageOffer} isCollapsed={isCollapsed} className={className} />
            {!isCollapsed && (
                <>
                    <Features className={className} features={packageOffer.value.features} />
                    <footer className={`${className}__footer`}>
                        {!packageOffer.disabled ? (
                            <>
                                {packageOffer.value.imageUrl && <img src={packageOffer.value.imageUrl} />}
                                {packageOffer.prices[0] && (
                                    <Price className={className} price={packageOffer.prices[0]} />
                                )}
                            </>
                        ) : (
                            <IconAvailability status={AvailabilityStatus.WARNING} customClassNames="flex items-center">
                                <FormattedMessage id="LABEL_PACKAGE_FILTER_OPTION_DISABLED" />
                            </IconAvailability>
                        )}
                    </footer>
                </>
            )}
        </li>
    );
};
