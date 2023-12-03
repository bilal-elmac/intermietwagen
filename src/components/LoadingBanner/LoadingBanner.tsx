import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { hasOffers as selectHasOffers } from '../../domain/AppState';

import { useReduxState } from '../../reducers/Actions';

import IconCustomCheck from '../../ui/IconCustomCheck';
import { LogoNoText } from '../../ui/Logo';

import { boldFormatter } from '../../utils/FormatterUtils';
import { isMobile, isTabletOrSmaller, isTablet } from '../../utils/MediaQueryUtils';

// in seconds
const LOGOS_ANIMATION_DELAY = 7;
const BOXES_LABELS = [
    ['ONLOAD_BANNER_BOX_FIRST_TITLE', 'ONLOAD_BANNER_BOX_FIRST_CONTENT'],
    ['ONLOAD_BANNER_BOX_SECOND_TITLE', 'ONLOAD_BANNER_BOX_SECOND_CONTENT'],
    ['ONLOAD_BANNER_BOX_THIRD_TITLE', 'ONLOAD_BANNER_BOX_THIRD_CONTENT'],
];

const baseClass = 'hc-results-view__loading-banner';

const BannerItem: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }): JSX.Element => (
    <li className={`${baseClass}__features-list__item`}>
        <IconCustomCheck className={`${baseClass}__features-list__item--icon`} />
        {children}
    </li>
);

/**
 * This array needs to average 1, in order to fill 100% of the width by the time it loads
 *
 * 100                                x
 * 075                  x      x
 * 050           x
 * 025
 * 000    x
 *      0.00   0.25   0.50   0.75   1.00
 */
const PROGRESS_DEVIATION_STEPS = [2, 2 / 3, 2 / 3, 2 / 3];
export const calculateDeviatedProgress = (progress: number): number => {
    const base = 1 / PROGRESS_DEVIATION_STEPS.length;
    return PROGRESS_DEVIATION_STEPS.reduce((reduced, step) => {
        const multiplier = progress > base ? base : Math.max(progress, 0);
        progress -= base;
        return reduced + multiplier * step * 100;
    }, 0);
};

// The min value is one, in order to not cutoff the icon
const MINIMAL_LOAD = 1;
// The loader should not be at 100% by the time the next request comes
export const UNDERLOAD_RATE = 0.9;

/**
 * Returns a number between 1 and 100
 */
const useLoadingPercentage = (): number => {
    const [fakeLoading, setFakeLoading] = useState(1);
    const reloadTime = useReduxState(({ staticConfiguration }) => staticConfiguration.loadingBannerTimespan);
    const rateSearchKey = useReduxState(({ rateSearchKey }) => rateSearchKey);
    const refreshRate = reloadTime / 100;

    useEffect(() => {
        const start = Date.now();
        const end = start + reloadTime / UNDERLOAD_RATE;

        const intervalId = setInterval(() => {
            if (fakeLoading === 100) {
                clearInterval(intervalId);
            }

            // The actual progress
            const progress = Math.min((Date.now() - start) / (end - start), 1);

            const deviatedProgress = calculateDeviatedProgress(progress);
            setFakeLoading(Math.max(Math.min(deviatedProgress, 100), MINIMAL_LOAD));
        }, refreshRate);

        return (): void => clearInterval(intervalId);
    }, [rateSearchKey]);

    return fakeLoading;
};

const ProgressBarIcon = (): JSX.Element => {
    const className = `${baseClass}__progress-bar__bar__icon-wrapper`;
    const loadedPercentage = Math.round(useLoadingPercentage());

    return (
        <div className={className}>
            <h2 className={`${className}__summary`}>{loadedPercentage}%</h2>
            <LogoNoText className={`${className}__icon`} />
        </div>
    );
};

const ProgressBar = (): JSX.Element | null => {
    const loadedPercentage = useLoadingPercentage();
    const isTabletDevice = isTabletOrSmaller();

    return (
        <div className={classNames(`${baseClass}__progress-bar`, isTabletDevice ? 'px-5' : 'pl-2')}>
            <div className={`${baseClass}__progress-bar__bar`}>
                <div className={`${baseClass}__progress-bar__bar__road`} />
                <div className={`${baseClass}__progress-bar__bar__loaded`} style={{ width: `${loadedPercentage}%` }}>
                    <ProgressBarIcon />
                </div>
            </div>
        </div>
    );
};

const Features = (): JSX.Element => {
    const isMobileDevice = isMobile();
    const displayVertically = isTablet();

    return (
        <ul
            className={classNames(
                `${baseClass}__features-list`,
                displayVertically && 'vertical',
                isMobileDevice && 'px-2',
            )}
        >
            {BOXES_LABELS.map(([title, content], idx) => (
                <BannerItem key={idx}>
                    <h4 className="text-blue">
                        <FormattedMessage id={title} values={{ strong: boldFormatter }} />
                    </h4>
                    <p className="text-xs">
                        <FormattedMessage id={content} values={{ strong: boldFormatter }} />
                    </p>
                </BannerItem>
            ))}
        </ul>
    );
};

const Suppliers = (): JSX.Element | null => {
    const suppliersLogos = useReduxState(state => state.dynamicConfiguration?.loadingSuppliers);
    const displayVertically = isTablet();
    const isMobileDevice = isMobile();

    if (!suppliersLogos || !suppliersLogos.length) {
        return null;
    }

    return (
        <div className={classNames(`${baseClass}__suppliers`, displayVertically ? 'vertical' : 'horizontal')}>
            <p className={classNames(`${baseClass}__suppliers--label`, isMobileDevice && 'px-2')}>
                <FormattedMessage id="ONLOAD_BANNER_LIST_LABEL" values={{ strong: boldFormatter }} />
            </p>
            <ul
                className={classNames(
                    `${baseClass}__suppliers__list mb-5 w-full pl-1 pr-1`,
                    !displayVertically && 'flex',
                )}
            >
                {suppliersLogos.map(({ logoUrl, name }, idx) => (
                    <li key={idx}>
                        <img
                            className={classNames(
                                `${baseClass}__suppliers__list--logo`,
                                displayVertically && 'vertical',
                            )}
                            src={logoUrl}
                            alt={name}
                            style={{ animationDelay: `${LOGOS_ANIMATION_DELAY + idx}s` }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Header = (): JSX.Element => {
    const isMobileDevice = isMobile();
    const isTabletDevice = isTabletOrSmaller();
    const pickUpName = useReduxState(state => state.search && state.search.pickUp.locationName);

    return (
        <header
            className={classNames(`${baseClass}__header`, isMobileDevice && 'text-center', isTabletDevice && 'px-2')}
        >
            <h2 className={classNames('font-bold text-blue', isMobileDevice ? 'text-md' : 'text-xl')}>
                <FormattedMessage id="LABEL_ONLOAD_BANNER_TITLE" values={{ pickUpName }} />
            </h2>
            <h3>
                <FormattedMessage id="LABEL_ONLOAD_BANNER_SUBTITLE" />
            </h3>
        </header>
    );
};

export const LoadingBanner = (): JSX.Element | null => {
    const displayHorizontally = isTablet();
    const hasOffers = useReduxState(selectHasOffers);
    if (hasOffers) {
        return null;
    }

    return (
        <div className={baseClass}>
            <Header />
            <ProgressBar />
            {displayHorizontally ? (
                <div className="flex">
                    <Features />
                    <Suppliers />
                </div>
            ) : (
                <>
                    <Features />
                    <Suppliers />
                </>
            )}
        </div>
    );
};
