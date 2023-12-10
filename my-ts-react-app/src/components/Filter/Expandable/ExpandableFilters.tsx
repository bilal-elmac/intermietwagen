import React from 'react';

import { FilterTooltip, CollapsableFilter } from '../Panel';
import { FilterOptionsGroup, FilterOptionsGroupArgs } from '../OptionsGroup';

export interface FilterWrapperProps {
    readonly title: React.ReactNode;
    readonly tooltip?: FilterTooltip;
    readonly expandOnStart?: boolean;
    readonly description?: string | JSX.Element;
}

export const ExpandableFilter: React.FC<FilterWrapperProps & FilterOptionsGroupArgs> = ({
    expandOnStart = true,
    children,
    ...props
}): JSX.Element => (
    <CollapsableFilter expandOnStart={expandOnStart} {...props}>
        <FilterOptionsGroup>{children}</FilterOptionsGroup>
    </CollapsableFilter>
);
