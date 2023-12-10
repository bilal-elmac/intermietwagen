import React from 'react';

import { FormattedMessage } from 'react-intl';
import { ChecklistFilter } from '../Checklist';
import { BaseProps } from '../BaseFilter';
import { FilterWrapperProps, ExpandableFilter } from './ExpandableFilters';

interface ChecklistFilterProps<O> extends BaseProps<O>, FilterWrapperProps {
    readonly expandOnStart?: boolean;
    readonly title: string;
}

export const ExpandableChecklistFilter = <O extends unknown>({
    options,
    title,
    ...others
}: ChecklistFilterProps<O>): JSX.Element | null => {
    const hasOptions = options.some(({ options }) => options.length);
    if (!hasOptions) {
        return null;
    }

    return (
        <ExpandableFilter {...others} title={<FormattedMessage id={title} />}>
            <ChecklistFilter options={options} />
        </ExpandableFilter>
    );
};
