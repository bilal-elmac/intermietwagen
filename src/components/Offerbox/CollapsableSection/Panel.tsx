import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Collapse, Tabs, Tab } from '@material-ui/core';
import classNames from 'classnames';

import TotalPrice from '../TotalPrice';
import { TotalPriceProps } from '../TotalPrice/TotalPrice';

import IconClose from '../../../ui/IconClose';
import Button from '../../../ui/Button';
import { ViewOfferSection, ViewOfferSectionProps } from '../ViewOfferSection';

import { useOfferboxTabs } from '.';
import { useServices } from '../../../state/Services.context';

export enum RentalConditionsPanelTabs {
    VEHICLE_SPECS = 1,
    RATINGS = 2,
    TERMS_AND_CONDITIONS = 3,
    PRICE_DETAILS = 4,
    SANITATION = 5,
}

interface PanelContentProps {
    readonly children?: React.ReactNode;
    readonly hidden: boolean;
    readonly customClassNames?: string;
}

const PanelContent = (props: PanelContentProps): JSX.Element => {
    const { children, hidden, customClassNames } = props;
    const classes = classNames(hidden ? customClassNames + ' hidden' : customClassNames);

    return <div className={classes}>{children}</div>;
};

export interface TabProps {
    readonly tabLabel: string;
    readonly isPanelActive?: boolean;
    readonly tabIcon?: React.ReactElement;
    readonly tabId: RentalConditionsPanelTabs;
}

type ViewOfferProps = Pick<ViewOfferSectionProps, 'onGoToOffer' | 'onGoToPartnerOffer' | 'provider'>;

interface Props extends TotalPriceProps, ViewOfferProps {
    readonly collapsableRef: React.RefObject<HTMLDivElement>;
    readonly rateId: string;
    readonly children: React.ReactElement<TabProps>[];
    readonly offerBoxClass: string;
}

export const Panel: React.FC<Props> = ({
    rateId,
    provider,
    children,
    offerBoxClass,
    totalPrice,
    rentDays,
    textPerDay,
    collapsableRef,
    onGoToOffer,
    onGoToPartnerOffer,
}) => {
    const { analyticsService } = useServices();
    const [activeTab, setActiveTab] = useOfferboxTabs();
    const toggleTab = (tab: RentalConditionsPanelTabs | null): void => {
        setActiveTab(tab);
        if (activeTab === null || tab === null) {
            analyticsService.onTermsAndConditionsToggle(tab !== null);
        }
        if (tab) {
            analyticsService.onTermsAndConditionsTabOpen(tab);
        }
    };

    const tabs: JSX.Element[] = [];
    let tabsContent: JSX.Element | null = null;
    const tabValue = children.findIndex(child => child.props.tabId === activeTab);

    React.Children.forEach(children, (child: React.ReactElement<TabProps>, idx) => {
        tabs.push(
            <Tab
                classes={{
                    root: `${offerBoxClass}__rental-conditions-container__tab`,
                    selected: `${offerBoxClass}__rental-conditions-container__tab-selected`,
                }}
                key={idx}
                icon={child.props.tabIcon}
                label={<FormattedMessage id={child.props.tabLabel} />}
            />,
        );

        if (tabValue === idx) {
            tabsContent = (
                <PanelContent
                    key={idx}
                    customClassNames={`${offerBoxClass}__rental-conditions-container__content`}
                    hidden={false}
                >
                    {React.cloneElement(child, { isPanelActive: true })}
                </PanelContent>
            );
        }
    });

    return (
        <Collapse
            ref={collapsableRef}
            className={`${offerBoxClass}__rental-conditions-container`}
            in={activeTab !== null}
        >
            <Tabs
                classes={{
                    root: `${offerBoxClass}__rental-conditions-container__tabs`,
                    indicator: `${offerBoxClass}__rental-conditions-container__tabs-indicator`,
                }}
                value={tabValue >= 0 ? tabValue : RentalConditionsPanelTabs.VEHICLE_SPECS}
                onChange={(_event: React.ChangeEvent<{}>, newValue: number): void =>
                    toggleTab(children[newValue].props.tabId)
                }
            >
                {tabs}
            </Tabs>
            <Button
                id={`${offerBoxClass}__rental-conditions-container__icon-close`}
                name="terms-and-conditions-button"
                className={`${offerBoxClass}__rental-conditions-container__icon-close`}
                onClick={(): void => toggleTab(null)}
            >
                <IconClose />
            </Button>
            {tabsContent}
            <div className={`${offerBoxClass}__rental-conditions-container__footer`}>
                <TotalPrice
                    totalPrice={totalPrice}
                    rentDays={rentDays}
                    textPerDay={textPerDay}
                    offerBoxClass={`${offerBoxClass}__rental-conditions-container__footer__price-details`}
                />
                <ViewOfferSection
                    id={`${rateId}-footer`}
                    provider={provider}
                    orientation="horizontal"
                    onGoToOffer={onGoToOffer}
                    onGoToPartnerOffer={onGoToPartnerOffer}
                />
            </div>
        </Collapse>
    );
};
