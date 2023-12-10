import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore, PhoneInTalk } from '@material-ui/icons';

import { useReduxState } from '../../reducers/Actions';

import { useNavigation } from '../../state/Navigation.context';
import { useServices } from '../../state/Services.context';
import { useDatePicker } from '../../state/DatePicker.context';
import { isMobile } from '../../utils/MediaQueryUtils';
import { boldFormatter } from '../../utils/FormatterUtils';

import FAQ from '../FAQ';

type HelpComponentProps = {
    expanded?: boolean;
};

const BASE_CLASS = 'hc-results-view__help-contact';

const HotLineComponent: React.FC<{}> = (): JSX.Element | null => {
    const intl = useIntl();
    const hasHotline = useReduxState(state => state.staticConfiguration.hasHotline);

    return hasHotline ? (
        <>
            <div>
                <p className={`${BASE_CLASS}__support-section`}>
                    <span className={`${BASE_CLASS}__support-section-title`}>
                        <strong>
                            <FormattedMessage id="FAQ_INTEGRATED_SUPPORT_TITLE" />
                        </strong>
                    </span>
                    <span className="flex">
                        <span className="block mr-10">
                            <FormattedMessage
                                tagName="strong"
                                id="FAQ_INTEGRATED_SUPPORT_DAYS"
                                values={{ br: <br /> }}
                            />
                        </span>
                        <span className="block">
                            <FormattedMessage id="FAQ_INTEGRATED_SUPPORT_HOURS" values={{ br: <br /> }} />
                        </span>
                    </span>
                </p>
            </div>
            <div>
                <a href={`tel:${intl.formatMessage({ id: 'LOCAL_HOTLINE' })}`} className="flex">
                    <div>
                        <PhoneInTalk className="text-blue mr-2" />
                    </div>
                    <div className="flex flex-col">
                        <span>
                            <FormattedMessage id="LOCAL_HOTLINE" />
                        </span>
                        <span className="text-xs">
                            <FormattedMessage
                                id="LOCAL_HOTLINE_ADDITIONAL_INFORMATION"
                                values={{ strong: boldFormatter }}
                            />
                        </span>
                    </div>
                </a>
            </div>
        </>
    ) : null;
};

export const HelpComponent: React.FC<HelpComponentProps> = () => {
    const intl = useIntl();
    const { analyticsService } = useServices();
    const hasFAQWebsite = useReduxState(state => state.staticConfiguration.hasFAQWebsite);
    const faqLink = useReduxState(state => state.staticConfiguration.faqLink);
    const [navigationState, updateNavigationState] = useNavigation();
    const [, updateDatePickerState] = useDatePicker();
    const isPhoneDevice = isMobile();

    return (
        <div className="hc-results-view__header__help">
            <Accordion
                classes={{
                    root: BASE_CLASS,
                    expanded: `${BASE_CLASS}--expanded`,
                    disabled: `${BASE_CLASS}--disabled`,
                }}
                onChange={(_e: React.ChangeEvent<{}>, expanded: boolean): void => {
                    updateNavigationState({ type: 'SET_HELP_VISIBILITY', payload: expanded });
                    if (expanded) {
                        updateDatePickerState({ type: 'SET_CALENDAR_VISIBILITY', payload: false });
                        analyticsService.onHelpMenuOpened();
                    }
                }}
                expanded={navigationState.isHelpOpen}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore className="text-blue" fontSize={isPhoneDevice ? 'inherit' : 'default'} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    classes={{
                        root: `${BASE_CLASS}__summary`,
                        expanded: `${BASE_CLASS}__summary--expanded`,
                        focused: `${BASE_CLASS}__summary--focused`,
                        disabled: `${BASE_CLASS}__summary--disabled`,
                        content: `${BASE_CLASS}__summary-content`,
                        expandIcon: `${BASE_CLASS}__summary-icon-content`,
                    }}
                >
                    <p>
                        <FormattedMessage
                            id={isPhoneDevice ? 'GLOBAL_HELP_AND_INFORMATION_SHORT' : 'GLOBAL_HELP_AND_INFORMATION'}
                        />
                    </p>
                </AccordionSummary>

                <AccordionDetails
                    classes={{
                        root: `${BASE_CLASS}__details`,
                    }}
                >
                    <HotLineComponent />
                    <FAQ />
                    {hasFAQWebsite && faqLink && (
                        <div className={`${BASE_CLASS}__more-questions mt-3`}>
                            <a
                                className="underline font-bold text-blue text-sm"
                                href={faqLink}
                                title={intl.formatMessage({ id: 'FAQ_MORE_QUESTIONS' })}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <FormattedMessage id="FAQ_MORE_QUESTIONS" />
                            </a>
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
        </div>
    );
};
