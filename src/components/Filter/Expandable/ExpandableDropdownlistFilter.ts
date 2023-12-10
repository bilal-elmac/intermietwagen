import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Dropdown from '../../../ui/Dropdown';
import PulseLoader from '../../../ui/PulseLoader';
import { FirstParameter } from '../../../utils/TypeUtils';

import { BaseProps, sortByLabel } from '../BaseFilter';
import { FilterDescription } from '../OptionsGroup';
import { FilterWrapperProps, ExpandableFilter } from './ExpandableFilters';

type DropdownWrapperProps = FirstParameter<typeof FilterDescription> & FirstParameter<typeof Dropdown>;

const DropdownWrapper = ({
    description,
    initialSelectedIndex,
    ...others
}: DropdownWrapperProps): JSX.Element | null => {
    const [hide, setHide] = useState(false);

    /**
     * Deal with technical debt ENG-2920
     */
    useEffect(() => {
        if (initialSelectedIndex !== 0) {
            return;
        }

        // Flag for when the component gets disposed
        let die = false;

        setHide(true);
        setTimeout(() => !die && setHide(false), 0);

        return (): void => {
            die = true;
        };
    }, [initialSelectedIndex === 0]);

    return (
        <>
            <FilterDescription description={description} />
            {hide ? (
                <PulseLoader className="h-10"></PulseLoader>
            ) : (
                <Dropdown {...others} initialSelectedIndex={initialSelectedIndex} />
            )}
        </>
    );
};

interface DropdownFilterProps<O> extends BaseProps<O>, FilterWrapperProps {
    readonly customDropdownIcon?: React.ReactChild;
    readonly buttonTextWrapperClassName?: string;
    // TODO Move this inside BaseProps['options']
    readonly defaultItems?: string[];
    readonly title: string;
}

export const ExpandableDropdownlistFilter = <O extends unknown>({
    options,
    customDropdownIcon,
    buttonTextWrapperClassName,
    defaultItems = [],
    title,
    ...others
}: DropdownFilterProps<O>): JSX.Element => (
    <ExpandableFilter {...others} title={<FormattedMessage id={title} />}>
        {options.map(({ options, description, onChange, overrideDisabled, sort, onReset, renderLabel }, k) => {
            const items: (string | number)[] = [];
            const itemsToDisplay: string[] = [...defaultItems];
            let selected = 0;

            const renderedOptions = sortByLabel(options, renderLabel, sort);
            renderedOptions.forEach(([oLabel, o]) => {
                items.push(oLabel);
                if (!(overrideDisabled ? overrideDisabled(o) : o.disabled)) {
                    itemsToDisplay.push(oLabel);
                }

                if (o.selected) {
                    selected = itemsToDisplay.length - 1;
                }
            });

            return (
                <DropdownWrapper
                    key={k}
                    // FilterDescription props
                    description={description}
                    // Dropdown props
                    customButtonRightIcon={customDropdownIcon}
                    customStyles="hc-results-view__filter-dropdown"
                    items={itemsToDisplay}
                    wrapButtonText
                    buttonTextWrapperClassName={buttonTextWrapperClassName}
                    onChange={(e): void => {
                        const selected = e.selectedItem && renderedOptions[items.indexOf(e.selectedItem)];
                        if (selected) {
                            onChange({ ...selected[1], selected: true });
                        } else {
                            onReset && onReset();
                        }
                    }}
                    initialSelectedIndex={selected}
                />
            );
        })}
    </ExpandableFilter>
);
