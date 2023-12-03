import React, { ReactNodeArray, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { boldFormatter } from '../../utils/FormatterUtils';
import { AdBannerType } from '../../domain/AdBanner';

import IconCustomCheck from '../../ui/IconCustomCheck';
import { LogoNoText } from '../../ui/Logo';

// Graphs
import AboutBannerSearchGraph from '../../public/assets/graphs/about-banner-search.png';
import AboutBannerSearchGraph2x from '../../public/assets/graphs/about-banner-search@2x.png';
import AboutBannerSearchGraph3x from '../../public/assets/graphs/about-banner-search@3x.png';
import AboutBannerFiltersGraph from '../../public/assets/graphs/about-banner-filters.png';
import AboutBannerFiltersGraph2x from '../../public/assets/graphs/about-banner-filters@2x.png';
import AboutBannerFiltersGraph3x from '../../public/assets/graphs/about-banner-filters@3x.png';
import AboutBannerOfferGraph from '../../public/assets/graphs/about-banner-offer.png';
import AboutBannerOfferGraph2x from '../../public/assets/graphs/about-banner-offer@2x.png';
import AboutBannerOfferGraph3x from '../../public/assets/graphs/about-banner-offer@3x.png';

interface OverviewItemProps {
    readonly children: string | ReactNodeArray | ReactNode;
}

const OverviewItem = (props: OverviewItemProps): JSX.Element => (
    <li>
        <IconCustomCheck className="hc-results-view__about-banner__overview-container__overview-item-box__check-icon" />
        <p>{props.children}</p>
    </li>
);

interface AboutBannerProps {
    readonly withGraphs: AdBannerType | null;
}

export const AboutBanner: React.FC<AboutBannerProps> = ({ withGraphs }) => {
    const baseClass = 'hc-results-view__about-banner';

    return (
        <>
            <div className={`${baseClass}__header-container`}>
                <LogoNoText fontSize="large" />
                <div className={`${baseClass}__header-container__title-container`}>
                    <h2 className="font-bold">
                        <FormattedMessage id="LABEL_HOW_HAPPYCAR_WORKS" />
                    </h2>
                    <h3>
                        <FormattedMessage id="LABEL_ABOUT_BANNER_SUBTITLE" values={{ strong: boldFormatter }} />
                    </h3>
                </div>
            </div>
            <div className={`${baseClass}__overview-container`}>
                <div className={`${baseClass}__overview-container__overview-item-box`}>
                    {withGraphs ? (
                        <img
                            src={AboutBannerSearchGraph}
                            srcSet={`${AboutBannerSearchGraph2x} 2x, ${AboutBannerSearchGraph3x} 3x`}
                            className="block"
                            aria-hidden="true"
                        />
                    ) : null}
                    <ul>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_COMPARISSON"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_STATIONS"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                    </ul>
                </div>
                <div className={`${baseClass}__overview-container__overview-item-box`}>
                    {withGraphs ? (
                        <img
                            src={AboutBannerFiltersGraph}
                            srcSet={`${AboutBannerFiltersGraph2x} 2x, ${AboutBannerFiltersGraph3x} 3x`}
                            className="block"
                            aria-hidden="true"
                        />
                    ) : null}
                    <ul>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_CAR_CLASSES"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_INSURANCE"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                    </ul>
                </div>
                <div className={`${baseClass}__overview-container__overview-item-box`}>
                    {withGraphs ? (
                        <img
                            src={AboutBannerOfferGraph}
                            srcSet={`${AboutBannerOfferGraph2x} 2x, ${AboutBannerOfferGraph3x} 3x`}
                            className="block"
                            aria-hidden="true"
                        />
                    ) : null}
                    <ul>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_OFFER"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                        <OverviewItem>
                            <FormattedMessage
                                id="ABOUT_BANNER_OVERVIEW_TEXT_CANCELLATION"
                                values={{ strong: boldFormatter }}
                            />
                        </OverviewItem>
                    </ul>
                </div>
            </div>
        </>
    );
};
