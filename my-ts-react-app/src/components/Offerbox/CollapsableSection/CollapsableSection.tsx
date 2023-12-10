import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Offer } from '../../../domain/Offer';

import { ViewOfferSectionProps } from '../ViewOfferSection';

import RatingsContent from './Contents/RatingsContent';
import TermsAndConditionsContent from './Contents/TermsAndConditionsContent';
import VehicleDetails from './Contents/VehicleDetails';
import PriceDetails from './Contents/PriceDetails';
import SanitationDetails from './Contents/SanitationDetails';
import { Panel, RentalConditionsPanelTabs, TabProps } from './Panel';

import IconCleanWheel from '../../../ui/IconCleanWheel';

interface CollapsableSectionProps extends Pick<ViewOfferSectionProps, 'onGoToOffer' | 'onGoToPartnerOffer'>, Offer {
    readonly offerBoxClass: string;
    readonly collapsableRef: React.RefObject<HTMLDivElement>;
    readonly rentDays: number | null;
}

export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
    offerBoxClass,
    vehicle,
    provider,
    supplier,
    priceDetails,
    rentDays,
    ratings,
    rateId,
    hasSanitationGuarantee,
    collapsableRef,
    onGoToOffer,
    onGoToPartnerOffer,
}): JSX.Element => {
    const sections: React.ReactElement<TabProps>[] = [];

    sections.push(
        <VehicleDetails
            {...vehicle}
            key={sections.length}
            customClassNames={`${offerBoxClass}__rental-conditions-container__content__vehicle-details`}
            tabLabel="LABEL_VEHICLE_DETAILS"
            tabId={RentalConditionsPanelTabs.VEHICLE_SPECS}
        />,
    );

    if (Object.values(ratings).some(r => r)) {
        sections.push(
            <RatingsContent
                key={sections.length}
                customClassNames={`${offerBoxClass}__rental-conditions-container__content__ratings`}
                tabLabel="LABEL_CUSTOMER_RATINGS"
                ratings={ratings}
                supplier={supplier}
                tabId={RentalConditionsPanelTabs.RATINGS}
            />,
        );
    }

    sections.push(
        <TermsAndConditionsContent
            key={sections.length}
            customClassNames={`${offerBoxClass}__rental-conditions-container__content__terms`}
            tabLabel="LABEL_RENTAL_CONDITIONS"
            rateId={rateId}
            tabId={RentalConditionsPanelTabs.TERMS_AND_CONDITIONS}
        />,
    );

    sections.push(
        <PriceDetails
            key={sections.length}
            customClassNames={`${offerBoxClass}__rental-conditions-container__content__price-details`}
            tabLabel="LABEL_PRICE_OVERVIEW"
            priceDetails={priceDetails}
            tabId={RentalConditionsPanelTabs.PRICE_DETAILS}
        />,
    );

    if (hasSanitationGuarantee) {
        sections.push(
            <SanitationDetails
                key={sections.length}
                className={`${offerBoxClass}__rental-conditions-container__content__sanitation-details`}
                tabLabel="LABEL_SANITATION_DETAILS"
                tabIcon={<IconCleanWheel className={`${offerBoxClass}__rental-conditions-container__tab-icon`} />}
                tabId={RentalConditionsPanelTabs.SANITATION}
                provider={provider}
            />,
        );
    }

    return (
        <Panel
            rateId={rateId}
            offerBoxClass={offerBoxClass}
            totalPrice={priceDetails.totalPrice}
            rentDays={rentDays}
            textPerDay={<FormattedMessage id="OFFER_BOX_PER_DAY" />}
            provider={provider}
            onGoToOffer={onGoToOffer}
            onGoToPartnerOffer={onGoToPartnerOffer}
            collapsableRef={collapsableRef}
        >
            {sections}
        </Panel>
    );
};
