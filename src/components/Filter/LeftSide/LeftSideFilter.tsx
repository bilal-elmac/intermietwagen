import React from 'react';
import classNames from 'classnames';

export const LeftSideFilter = ({
    hasFilters,
    ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    hasFilters: boolean;
}): JSX.Element => (
    <div {...props} className={classNames('hc-results-view__left-side-filter', hasFilters && 'shadow')} />
);
