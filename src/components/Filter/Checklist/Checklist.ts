import React, { useEffect, createRef } from 'react';

import { FilterOptionsList } from '../OptionsGroup';
import { FilterOption } from '../Option';
import { BaseProps, OptionsList, sortByLabel } from '../BaseFilter';

import { scrollTo } from '../../../utils/ScrollUtils';
import { Throttler } from '../../../utils/ThrottleUtils';

const EVENTS_DELTA_IN_MILLISECONDS = 5;

interface CheckListProps<O> extends Partial<OptionsList<O>> {
    selectedPosition: number;
    children: React.ReactChild[];
}

const CheckListWrapper = <O extends unknown>({
    description,
    hasIcons,
    isHorizontal,
    selectedPosition,
    children,
}: CheckListProps<O>): JSX.Element => {
    const listRef = createRef<HTMLUListElement>();

    // If horizontal filter, scroll list to selected item
    useEffect(() => {
        if (isHorizontal) {
            scrollTo('horizontal', listRef.current, selectedPosition);
        }
    }, [selectedPosition, isHorizontal]);

    return (
        <FilterOptionsList description={description} hasIcons={hasIcons} listRef={listRef}>
            {children}
        </FilterOptionsList>
    );
};

export const ChecklistFilter = <O extends unknown>({ options }: BaseProps<O>): JSX.Element => (
    <>
        {options.map(
            (
                {
                    options,
                    description,
                    onChange,
                    renderLabel,
                    sort,
                    overrideDisabled,
                    renderIcon,
                    hasIcons,
                    isHorizontal,
                },
                k,
            ) => {
                const sortedOptions = sortByLabel(options, renderLabel, sort);

                const selectedPosition = sortedOptions.map(item => item[1]).findIndex(item => item.selected);

                return (
                    <CheckListWrapper
                        key={k}
                        description={description}
                        hasIcons={hasIcons}
                        isHorizontal={isHorizontal}
                        selectedPosition={selectedPosition}
                    >
                        {sortedOptions.map(
                            ([generatedLabel, option], k): JSX.Element => {
                                const throttler = new Throttler(EVENTS_DELTA_IN_MILLISECONDS);
                                const disabled = overrideDisabled ? overrideDisabled(option) : option.disabled;

                                return (
                                    <FilterOption
                                        bordered
                                        disabled={disabled}
                                        key={k}
                                        showFakeCheckbox={!hasIcons}
                                        isSquare={hasIcons}
                                        icon={(hasIcons && renderIcon && renderIcon(option)) || null}
                                        checked={option.selected === true}
                                        onChange={({
                                            target: { checked },
                                        }: React.ChangeEvent<HTMLInputElement>): void =>
                                            throttler.run(() => !disabled && onChange({ ...option, selected: checked }))
                                        }
                                        onClick={(): void =>
                                            throttler.run(
                                                () => !disabled && onChange({ ...option, selected: !option.selected }),
                                            )
                                        }
                                        prices={option.prices}
                                    >
                                        <div className="hc-results-view__checklist-filter__label-content">
                                            {generatedLabel}
                                        </div>
                                    </FilterOption>
                                );
                            },
                        )}
                    </CheckListWrapper>
                );
            },
        )}
    </>
);
