import React, { RefObject } from 'react';
import { FormattedMessage } from 'react-intl';

interface FilterOptionsListArgs {
    readonly description?: string;
    readonly children: React.ReactChild[];
    readonly hasIcons?: boolean;
    readonly listRef?: RefObject<HTMLUListElement>;
}

export const FilterDescription = ({ description }: { readonly description?: string }): JSX.Element => (
    <>
        {description && (
            <p className="hc-results-view__filter-options-group__description">
                <FormattedMessage id={description} />
            </p>
        )}
    </>
);

export const FilterOptionsList = ({ description, children, hasIcons, listRef }: FilterOptionsListArgs): JSX.Element =>
    children.length ? (
        <>
            <FilterDescription description={description} />
            <ul
                ref={listRef || null}
                className={`${
                    hasIcons ? 'hc-results-view__filter-options-group--with-icons' : 'flex flex-col'
                } lg:flex-col lg:flex`}
            >
                {children}
            </ul>
        </>
    ) : (
        <></>
    );

export interface FilterOptionsGroupArgs {
    readonly children: React.ReactElement<FilterOptionsListArgs> | Array<React.ReactElement<FilterOptionsListArgs>>;
}

export const FilterOptionsGroup = ({ children }: FilterOptionsGroupArgs): JSX.Element => (
    <div className="hc-results-view__filter-options-group">{children}</div>
);
