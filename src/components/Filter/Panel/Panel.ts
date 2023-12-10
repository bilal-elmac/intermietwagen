import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import InfoButton from '../../../ui/InfoButton';

const BASE_CSS_CLASS = 'hc-results-view__filter-panel';

interface FilterPanelArgs {
    readonly className?: string;
    readonly children?: React.ReactNode;
}

export const FilterPanel = ({ className, children }: FilterPanelArgs): JSX.Element => (
    <div className={classNames(BASE_CSS_CLASS, className)}>{children}</div>
);

interface HeaderArgs {
    readonly title: React.ReactNode;
    readonly onClick?: () => void;
    readonly expanded?: boolean;
    readonly tooltip?: FilterTooltip;
    readonly description?: string | JSX.Element;
}

export interface FilterTooltip {
    readonly tooltipTitle?: string;
    readonly tooltipContent: string;
}

const Tooltip = ({ tooltipTitle, tooltipContent }: FilterTooltip): JSX.Element => (
    <InfoButton tooltipId={`${BASE_CSS_CLASS}__tooltip`} buttonColor="grey">
        <div className={`${BASE_CSS_CLASS}__tooltip`}>
            {tooltipTitle && (
                <h3 className={`${BASE_CSS_CLASS}__tooltip__title`}>
                    <FormattedMessage id={tooltipTitle} />
                </h3>
            )}
            <p className={`${BASE_CSS_CLASS}__tooltip__description`}>
                <FormattedMessage id={tooltipContent} />
            </p>
        </div>
    </InfoButton>
);

export const Header = ({ title, onClick, expanded, tooltip, description }: HeaderArgs): JSX.Element => (
    <div className="header w-full flex flex-wrap" onClick={onClick}>
        <h3 className="title text-base">{title}</h3>
        {tooltip && <Tooltip {...tooltip} />}
        {expanded !== undefined && (expanded ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" />)}
        {description && (
            <p
                className={classNames(
                    'header__description',
                    !expanded && 'hidden',
                    'bg-light-blue text-light-grey p-2 text-sm',
                )}
            >
                {description}
            </p>
        )}
    </div>
);

interface CollapsableFilterArgs {
    readonly title: React.ReactNode;
    readonly children?: React.ReactNode;
    readonly tooltip?: FilterTooltip;
    readonly expandOnStart?: boolean;
    readonly expanded?: boolean;
    readonly description?: string | JSX.Element;
}

export const CollapsableFilter = ({ expandOnStart = true, children, ...props }: CollapsableFilterArgs): JSX.Element => {
    const [expanded, setExpanded] = React.useState<boolean>(expandOnStart);

    return (
        <FilterPanel className={`${BASE_CSS_CLASS}--collapsable font-sans`}>
            <Header onClick={(): void => setExpanded(!expanded)} expanded={expanded} {...props} />

            <Collapse in={expanded} timeout="auto">
                {children}
            </Collapse>
        </FilterPanel>
    );
};
