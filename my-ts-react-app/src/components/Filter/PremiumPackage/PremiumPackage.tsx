import React from 'react';
import { FormattedMessage } from 'react-intl';

import { OfferPackage, FilterOption } from '../../../domain/Filter';
import { OfferPackageFeature } from '../../../domain/OfferPackage';

import { updatePackageFilter } from '../../../reducers/FilterActions';
import { useReduxDispatch } from '../../../reducers/Actions';
import { useServices } from '../../../state/Services.context';

import Checkbox from '../../../ui/Checkbox';
import PriceLabel from '../../../ui/PriceLabel';
import IconAvailability, { AvailabilityStatus } from '../../../ui/IconAvailability';
import { sortPackageFeatures } from '../PackageFeaturesUtils';

import { Throttler } from '../../../utils/ThrottleUtils';
import { isMobile } from '../../../utils/MediaQueryUtils';
import { scrollToTop } from '../../../utils/ScrollUtils';

interface PremiumFilter {
    excellentPackage: FilterOption<OfferPackage>;
}

export const getColumnsConfiguration = (oneColumn: boolean, features: OfferPackageFeature[]): number[][] => {
    if (oneColumn) {
        return [[0, features.length]];
    }

    return [
        [0, Math.ceil(features.length / 2)],
        [Math.ceil(features.length / 2), features.length],
    ];
};

const BASE_CLASS = 'hc-results-view__content-premium-filter-package';

export const PremiumPackageFilter: React.FC<PremiumFilter> = ({ excellentPackage }): JSX.Element | null => {
    const dispatch = useReduxDispatch();

    const { analyticsService } = useServices();
    const isMobileDevice = isMobile();

    const [lowestPrice] = excellentPackage.prices;

    const throttler = new Throttler(50);
    const handleInteraction = (): void =>
        throttler.run(() => {
            dispatch(updatePackageFilter({ ...excellentPackage, selected: !excellentPackage.selected }));

            // Scroll Up
            scrollToTop();

            if (!excellentPackage.selected) {
                analyticsService.onPackagesBannerSelected(excellentPackage.value.type, 'mid');
            }
        });

    const features = sortPackageFeatures(excellentPackage.value.features);

    // columns to show features
    // array contains the first element from the list to show in a column and the last one
    const featuresColumnCount = getColumnsConfiguration(isMobileDevice, features);

    return (
        <article className={`${BASE_CLASS} md:flex-row`} onClick={(): void => handleInteraction()}>
            {/* package filter */}
            <section className={`${BASE_CLASS}__package w-full p-2 md:w-1/3 md:py-2 md:px-5`}>
                {!isMobileDevice && (
                    <p className={`${BASE_CLASS}__package-title`}>
                        <FormattedMessage id={`LABEL_PACKAGE_FILTER_HEADER_${excellentPackage.value.type}`} />{' '}
                        {lowestPrice && (
                            <small className="text-dark-grey md:text-green">
                                <FormattedMessage
                                    id="LABEL_MINIMALIST_PRICE_FROM"
                                    values={{
                                        price: (
                                            <strong className={`${BASE_CLASS}__package-title__price`}>
                                                <PriceLabel {...lowestPrice} alwaysHideDecimals />
                                            </strong>
                                        ),
                                    }}
                                />
                            </small>
                        )}
                    </p>
                )}
                <Checkbox
                    className={`${BASE_CLASS}__package-checkbox`}
                    disabled={excellentPackage.disabled}
                    bordered={true}
                    checked={excellentPackage.selected === true}
                    onChange={(): void => handleInteraction()}
                >
                    {isMobileDevice ? (
                        <div className="hc-results-view__filter-package__header-info">
                            <strong className="hc-results-view__filter-package__header-title text-green font-bold text-lg">
                                <FormattedMessage id={`LABEL_PACKAGE_FILTER_HEADER_EXCELLENT`} />
                            </strong>
                            {lowestPrice && (
                                <p className="hc-results-view__filter-package__header-description text-green text-sm leading-none">
                                    <FormattedMessage
                                        id="LABEL_PACKAGE_FILTER_HEADER_SUBTITLE"
                                        values={{
                                            price: (
                                                <span className="font-bold text-dark-grey text-xl">
                                                    <PriceLabel {...lowestPrice} alwaysHideDecimals />
                                                </span>
                                            ),
                                        }}
                                    />
                                </p>
                            )}
                        </div>
                    ) : (
                        <strong>
                            <FormattedMessage id="LABEL_SHOW_ONLY_EXCELLENT_OFFERS" />{' '}
                        </strong>
                    )}
                </Checkbox>
            </section>
            {/* premium package features in 2 columns */}
            {featuresColumnCount.map(([start, end], k) => (
                <section key={k} className={`${BASE_CLASS}__package-features`}>
                    <ul className={`${BASE_CLASS}__package-features-list`}>
                        {features.slice(start, end).map((feature, k) => (
                            <li key={k} className={`${BASE_CLASS}__package-features-item`}>
                                <IconAvailability customClassNames="flex text-sm" status={AvailabilityStatus.INFO}>
                                    <FormattedMessage
                                        id={`LABEL_PACKAGE_FEATURE_${feature}`}
                                        values={{ includes: true }}
                                    />
                                </IconAvailability>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </article>
    );
};
