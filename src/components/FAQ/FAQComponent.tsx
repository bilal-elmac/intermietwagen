import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './FAQ.css';

const FAQData: { question: string; answer: string }[] = [
    {
        question: 'FAQ_INTEGRATED_FIRST_QUESTION',
        answer: 'FAQ_INTEGRATED_FIRST_ANSWER',
    },
    {
        question: 'FAQ_INTEGRATED_SECOND_QUESTION',
        answer: 'FAQ_INTEGRATED_SECOND_ANSWER',
    },
    {
        question: 'FAQ_INTEGRATED_THIRD_QUESTION',
        answer: 'FAQ_INTEGRATED_THIRD_ANSWER',
    },
    {
        question: 'FAQ_INTEGRATED_FOURTH_QUESTION',
        answer: 'FAQ_INTEGRATED_FOURTH_ANSWER',
    },
];

export const FAQComponent: React.FC<{}> = () => {
    const [openedQt, setOpenedQt] = useState<number | null>(null);
    return (
        <>
            <h3>
                <FormattedMessage id="NAVIGATION_FAQ" />
            </h3>

            {FAQData.map((item, index) => {
                return (
                    <Accordion
                        key={index}
                        expanded={index === openedQt}
                        onChange={(_, isExpanded): void => (isExpanded ? setOpenedQt(index) : setOpenedQt(null))}
                        classes={{
                            root: 'hc-results-view__faq',
                            expanded: `hc-results-view__faq--expanded`,
                            disabled: `hc-results-view__faq--disabled`,
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon fontSize="inherit" />}
                            IconButtonProps={{
                                edge: 'start',
                            }}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            classes={{
                                root: `hc-results-view__faq__summary`,
                                expanded: `hc-results-view__faq__summary--expanded`,
                                focused: `hc-results-view__faq__summary--focused`,
                                disabled: `hc-results-view__faq__summary--disabled`,
                                content: `hc-results-view__faq__summary-content`,
                                expandIcon: `hc-results-view__faq__summary-icon-content`,
                            }}
                        >
                            <FormattedMessage id={item.question} />
                        </AccordionSummary>
                        <AccordionDetails
                            classes={{
                                root: `hc-results-view__faq__details`,
                            }}
                        >
                            <p>
                                {' '}
                                <FormattedMessage id={item.answer} />
                            </p>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
};
