import React, { createRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Offer } from '../../domain/Offer';

// UI
import IconAvailability, { AvailabilityStatus } from '../../ui/IconAvailability';
import Button from '../../ui/Button';
import IconTermsAndConditions from '../../ui/IconTermsAndConditions';
import Tooltip from '../../ui/Tooltip';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';
import { scrollTo } from '../../utils/ScrollUtils';

import { useServices } from '../../state/Services.context';
import {
    registerScrollPoint,
    ScrollMarks,
    useScrollPoints,
    useScrollPointFocus,
    ScrollCustomRef,
} from '../../state/Scrolling.context';

// Offer Box Components
import OfferTag from './OfferTag';
import CarInfo from './CarInfo';
import CarName from './CarName';
import SupplierProviderLogos from './SupplierProviderLogos';
import ProviderDetails from './ProviderDetails';
import SupplierRating from './SupplierRating';
import PaymentDetails from './PaymentDetails';
import TotalPrice from './TotalPrice';
import VehicleCharacteristics from './VehicleCharacteristics';
import Summary from './Summary';
import LocationDetails from './LocationDetails';
import AcceptedPayments from './AcceptedPayments';
import CollapsableSection, { CollapsableSectionProvider, useOfferboxTabs } from './CollapsableSection';
import { OfferboxProvider, ViewOfferState, useViewOfferStatus } from './OfferboxContext';
import SupplierWarning from './SupplierWarning';
import { RentalConditionsPanelTabs } from './CollapsableSection/Panel';
import { ViewOfferSection } from './ViewOfferSection';
import SanitationWarning from './SanitationWarning';

export interface Props extends Offer {
    readonly order?: number;
    readonly rentDays: number | null;
}

const Offerbox: React.FC<Props> = (props): JSX.Element => {
    const {
        hcPackage,
        vehicle,
        supplier,
        provider,
        priceDetails,
        pickUpDropOff,
        bookingUrl,
        partnerBookingUrl,
        rateId,
        hasSanitationGuarantee,
        order,
    } = props;

    const ref = registerScrollPoint<HTMLDivElement>(ScrollMarks.FIRST_OFFER);
    const getScrollPoint = useScrollPoints();
    const offerBoxClass = 'hc-results-view__offerbox';

    const collapsableRef = createRef<HTMLDivElement>();

    const { analyticsService } = useServices();
    const isMobile = isTabletOrSmaller();
    const [activeTab, setExpanded] = useOfferboxTabs();
    const [viewOfferStatus, setViewOfferStatus] = useViewOfferStatus();

    // Scroll to the first offer if requested
    let firstOfferRef: ScrollCustomRef<HTMLElement> | null = null;
    const updateFirstOfferPoint = useScrollPointFocus(ScrollMarks.FIRST_OFFER);
    if (order === 0) {
        firstOfferRef = getScrollPoint(ScrollMarks.FIRST_OFFER);
    }
    useEffect(() => {
        if (firstOfferRef && firstOfferRef?.shouldFocus && firstOfferRef.current) {
            scrollTo('toElm', firstOfferRef.current);
            const timer = setTimeout(() => updateFirstOfferPoint(false), 500);
            return (): void => clearTimeout(timer);
        }
    }, [firstOfferRef]);

    const openTab = (newActiveTab: RentalConditionsPanelTabs | null): void => {
        const newTab = newActiveTab === activeTab && newActiveTab !== null ? null : newActiveTab;

        // track when panel is open or closed
        if ((activeTab === null || newTab === null) && !isMobile) {
            analyticsService.onTermsAndConditionsToggle(Boolean(newTab));
        }

        if (newTab !== null && collapsableRef.current) {
            /**
             * If the user gets caught in the tooltip,
             * it will stop the scrolling prematurly
             */
            scrollTo('vertical', collapsableRef.current);
            // track the tab
            if (!isMobile) {
                analyticsService.onTermsAndConditionsTabOpen(newTab);
            }
        }
        setExpanded(newTab);
    };

    const goToBooking = (): void => {
        if (partnerBookingUrl) {
            /**
             * We offer the partner's booking form, the user chooses our offer
             * so a new window opens to our booking form
             * and the current window goes to the partners url
             */
            open(bookingUrl, '_blank');
            window.location.href = partnerBookingUrl;

            analyticsService.onGoToOffer(true);
        } else {
            /**
             * We don't offer the partner's booking form
             * so a new window opens to our booking form
             */
            open(bookingUrl, '_blank');
        }

        analyticsService.onGoToOffer(true);
    };

    /**
     * If there is no clickout, take the user to the booking form.
     * If there is, a “to partner" button appears.
     * Second click will act as clicking on the go to offer button.
     */
    const goToOffer = (): void => {
        if (!partnerBookingUrl || viewOfferStatus === ViewOfferState.LOADED) {
            return goToBooking();
        }

        setViewOfferStatus(ViewOfferState.LOADING);
        analyticsService.onGoToOffer(false, true);
    };

    /**
     * We offer the partner's booking form,
     * the user chooses the partners offer
     * so a new window opens to the partern's booking form
     */
    let goToPartnerOffer = null;
    if (partnerBookingUrl) {
        goToPartnerOffer = (): void => {
            open(partnerBookingUrl, '_blank');
            analyticsService.onGoToOffer(false);
        };
    }

    return (
        <div
            className={classNames(
                'bg-white',
                offerBoxClass,
                hcPackage === 'EXCELLENT' && `${offerBoxClass}--excellent`,
                supplier && supplier.isBad && `${offerBoxClass}--bad-supplier border-error border-solid`,
            )}
            onClick={(): void => {
                isMobile && goToOffer();
            }}
            style={{ order }}
            // ref for first offer
            ref={order === 0 ? ref : undefined}
        >
            <OfferTag hcPackage={hcPackage} offerBoxClass={offerBoxClass} />
            <CarInfo {...vehicle} offerBoxClass={offerBoxClass}>
                {hasSanitationGuarantee && (
                    <SanitationWarning onClick={(): void => openTab(RentalConditionsPanelTabs.SANITATION)} />
                )}
            </CarInfo>
            <CarName offerBoxClass={offerBoxClass} name={vehicle.name} />
            <PaymentDetails offerBoxClass={offerBoxClass}>
                <TotalPrice
                    totalPrice={priceDetails.totalPrice}
                    rentDays={props.rentDays}
                    textPerDay={<FormattedMessage id="OFFER_BOX_PER_DAY" />}
                    offerBoxClass={offerBoxClass}
                    onClick={(): void => openTab(RentalConditionsPanelTabs.PRICE_DETAILS)}
                />
                <ViewOfferSection
                    id={`${rateId}-payment-details`}
                    orientation="vertical"
                    provider={provider}
                    onGoToOffer={goToOffer}
                    onGoToPartnerOffer={goToPartnerOffer}
                />
                <Tooltip content={<FormattedMessage id="TOOLTIP_OFFER_BOX_CANCELLATION_NOTE" />}>
                    <IconAvailability
                        status={AvailabilityStatus.INFO}
                        customClassNames={`${offerBoxClass}__payment-details__payment-benefits`}
                    >
                        <FormattedMessage id="OFFER_BOX_BOOK_NOW_FREE_CANCELLATION" />
                    </IconAvailability>
                </Tooltip>
                <Tooltip content={<FormattedMessage id="TOOLTIP_OFFER_BOX_AVAILABILITY_NOTE" />}>
                    <IconAvailability
                        status={AvailabilityStatus.INFO}
                        customClassNames={`${offerBoxClass}__payment-details__payment-benefits`}
                    >
                        <FormattedMessage id="OFFER_BOX_BOOK_NOW_IMMEDIATELY_AVAILABLE" />
                    </IconAvailability>
                </Tooltip>
                <AcceptedPayments paymentMethods={priceDetails.paymentMethods} offerBoxClass={offerBoxClass} />
            </PaymentDetails>
            <VehicleCharacteristics
                {...vehicle}
                offerBoxClass={offerBoxClass}
                onCharacteristicsClick={(): void => openTab(RentalConditionsPanelTabs.VEHICLE_SPECS)}
            />
            <Summary {...props} offerBoxClass={offerBoxClass} openTab={openTab} />
            <LocationDetails {...pickUpDropOff} offerBoxClass={offerBoxClass} />
            <SupplierProviderLogos offerBoxClass={offerBoxClass} supplier={supplier} provider={provider} />
            <div className={`order-9 py-2 px-2 text-right bg-light-blue ${offerBoxClass}__supplier-provider-container`}>
                <SupplierRating
                    rating={supplier && supplier.rating}
                    offerBoxClass={offerBoxClass}
                    onClick={(): void => openTab(RentalConditionsPanelTabs.RATINGS)}
                />
                <ProviderDetails providerName={provider && provider.name} offerBoxClass={offerBoxClass} />
            </div>
            <Button
                id={`${offerBoxClass}__terms-and-conditions-button`}
                name="terms-and-conditions-button"
                version="inverted"
                onClick={(): void =>
                    openTab(activeTab === null ? RentalConditionsPanelTabs.TERMS_AND_CONDITIONS : null)
                }
                className={`${offerBoxClass}__terms-and-conditions-button`}
                iconLeft={<IconTermsAndConditions />}
            >
                <FormattedMessage id="OFFER_BOX_DETAILS_BUTTON" />
            </Button>
            {supplier && supplier.isBad && <SupplierWarning supplier={supplier} />}
            <CollapsableSection
                collapsableRef={collapsableRef}
                offerBoxClass={offerBoxClass}
                onGoToOffer={goToOffer}
                onGoToPartnerOffer={goToPartnerOffer}
                {...props}
            />
        </div>
    );
};

const CollapsableOfferbox = (props: Props): JSX.Element => (
    <CollapsableSectionProvider intialTab={null}>
        <OfferboxProvider intialStatus={ViewOfferState.INITIAL}>
            <Offerbox {...props} />
        </OfferboxProvider>
    </CollapsableSectionProvider>
);

export { CollapsableOfferbox as Offerbox };
