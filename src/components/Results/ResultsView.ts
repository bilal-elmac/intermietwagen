import React, { ReactNode } from 'react';

import {
    hasNoResults as selectHasNoResults,
    canSort as selectCanSort,
    hasOffers as selectHasOffers,
    shouldShowLoadingOfferboxes as selectShowLoadingOfferboxes,
    standardOffers as selectStandardOffers,
} from '../../domain/AppState';
import { PackageType } from '../../domain/OfferPackage';
import { hasError as selectHasError, isExpired as selectIsExpired } from '../../domain/LoadingStatus';
import { areAllPackagesAvailable, packageFilterOpton } from '../../domain/Filter';

import { closeBanner, BannersTypes } from '../../reducers/BannerActions';
import { useReduxDispatch, useReduxState } from '../../reducers/Actions';

import { useServices } from '../../state/Services.context';
import { useMap } from '../Map/Map.context';

import ClosableCard from '../../ui/ClosableCard';
import Delayed from '../../ui/Delayed';

import Offerbox, { LoadingOfferBox } from '../Offerbox';
import AboutBanner from '../AboutBanner/';
import QuickFilters from '../Filter/QuickFilters';
import SupplierCarousel from '../Filter/SupplierCarousel';
import ContentPremiumPackage from '../Filter/PremiumPackage';
import Pagination from '../Pagination';
import OrderDropdown from '../OrderDropdown/OrderDropdown';
import OffersSummary from '../OffersSummary';
import { SearchErrorModal, SearchErrorAlert, NoResultsAlert, NewResultsAlert } from '../Alert';
import { ReducedOpenMapButton, Map } from '../Map';
import LoadingBanner from '../LoadingBanner';

import { calculateRentDays } from '../../utils/TimeUtils';
import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';
import { ReactComponentsProps } from '../../utils/ReactUtils';
import { usePackagesUI } from '../../state/Packages.context';
import { useMapDesktopToggler } from '../Map/MapView/Utilts';

const ReducedBannerCard: React.FC<{
    children: ReactNode;
    minOffers: number;
    type: BannersTypes;
    size: ReactComponentsProps<typeof ClosableCard>['size'];
}> = ({ children, minOffers, type, size }) => {
    const dispatch = useReduxDispatch();
    const shouldDisplayBanner = useReduxState(s => s.offers.standard.length > minOffers + 1 && s.banners[type]);
    const { analyticsService } = useServices();

    if (!shouldDisplayBanner) {
        return null;
    }

    return (
        <ClosableCard
            size={size}
            onClose={(): void => {
                // save to state
                dispatch(closeBanner(type));
                analyticsService.onBannerCloseEvent();
            }}
            order={minOffers}
        >
            {children}
        </ClosableCard>
    );
};

export const ResultsView: React.FC<{}> = () => {
    const isMobileDevice = isTabletOrSmaller();

    const canSort = useReduxState(selectCanSort);
    const hasError = useReduxState(s => selectHasError(s.loading));
    const isExpired = useReduxState(s => selectIsExpired(s.loading));
    const hasOffers = useReduxState(selectHasOffers);
    const hasBuffer = useReduxState(s => Boolean(s.loadedBuffer));
    const showNoResults = useReduxState(selectHasNoResults);
    const showLoadingOfferboxes = useReduxState(selectShowLoadingOfferboxes);
    const showCarCategoryFilter = useReduxState(s => hasOffers && s.filters.packages.some(p => p && p.selected));
    const arePackagesAvailable = useReduxState(s => areAllPackagesAvailable(s.filters));

    const loadedTimes = useReduxState(s => s.loadedTimes);
    const isOneWay = useReduxState(state => state.search?.isOneWay);
    const currentPage = useReduxState(state => state.currentPage);

    const rentDays = useReduxState(s => s.search && calculateRentDays(s.search));
    const standardOffers = useReduxState(selectStandardOffers);
    const excellentPackage = useReduxState(state => packageFilterOpton(state.filters, PackageType.EXCELLENT));
    const adsType = useReduxState(state => state.adBannerType);

    // Map settings
    const [isMapOpen] = useMap();
    const [isPackageFilterOpen] = usePackagesUI();
    const isMapClosable = !isMobileDevice;
    const toggleMap = useMapDesktopToggler();

    return (
        <main className="hc-results-view__results bg-gray w-full overflow-hidden lg:my-5 lg:pr-5 lg:w-3/4 xl:my-5 xl:pr-5 xl:w-3/4">
            {showLoadingOfferboxes && !hasOffers && !isExpired && !showNoResults && <LoadingBanner />}
            {!isOneWay && <Map closeable />}
            {hasBuffer && !isExpired && <NewResultsAlert />}
            {isMobileDevice && <OffersSummary />}
            {hasError && hasOffers && <SearchErrorAlert />}
            {showNoResults && <NoResultsAlert />}
            <QuickFilters
                showPackagesFilter={hasOffers && arePackagesAvailable}
                showCovidBanner={!showNoResults}
                showCarCategoryFilter={showCarCategoryFilter}
                isCollapsed={!isPackageFilterOpen}
            />
            {!isMobileDevice && (
                <ReducedBannerCard size="large" type="adsBanner" minOffers={5}>
                    <AboutBanner withGraphs={adsType} />
                </ReducedBannerCard>
            )}
            {!isMobileDevice && (
                <div className="hc-results-view__results-nav flex flex-row w-full h-10 mb-4 justify-end">
                    {isMapClosable && (
                        <div className="flex mr-auto">
                            <ReducedOpenMapButton checked={isMapOpen} onChange={(): void => toggleMap(!isMapOpen)} />
                        </div>
                    )}
                    {canSort ? (
                        <>
                            <div className="w-1/4 self-center mr-3 ml-3">
                                <OffersSummary />
                            </div>
                            <div className="w-1/5">
                                <OrderDropdown />
                            </div>
                        </>
                    ) : (
                        <div className="w-1/4 self-center">
                            <OffersSummary />
                        </div>
                    )}
                </div>
            )}
            {!isMobileDevice && <SupplierCarousel />}
            {standardOffers.map((standardOffer, k) => (
                <Delayed
                    timeout={100 + Math.random() * (showLoadingOfferboxes ? 100 : 400)}
                    contentKey={[
                        showLoadingOfferboxes,
                        loadedTimes,
                        hasBuffer,
                        standardOffer && standardOffer.rateId,
                    ].join('-')}
                    key={`${currentPage}-${k}`}
                >
                    {standardOffer ? (
                        <Offerbox {...standardOffer} rentDays={rentDays} order={k} />
                    ) : (
                        <LoadingOfferBox />
                    )}
                </Delayed>
            ))}
            {excellentPackage && !excellentPackage.selected && !excellentPackage.disabled && (
                <ReducedBannerCard size="small" type="premiumPackageFilterBanner" minOffers={5}>
                    <ContentPremiumPackage excellentPackage={excellentPackage} />
                </ReducedBannerCard>
            )}
            {!showLoadingOfferboxes && hasOffers && (
                <QuickFilters
                    bottom
                    isCollapsed={!isPackageFilterOpen}
                    showPackagesFilter={hasOffers && arePackagesAvailable}
                />
            )}
            <Pagination />
            {hasError && !hasOffers && <SearchErrorModal />}
        </main>
    );
};
