import React from 'react';
import { useCombobox, UseComboboxState } from 'downshift';
import classNames from 'classnames';

import { AutocompleteSuggestion } from '../../domain/Autocomplete';

import { Airport, City, Railway } from '../IconStations';

const BASE_CLASS = 'hc-autocomplete';

type AutoCompleteProps = {
    label?: string;
    isLoading: boolean;
    initialValue: AutocompleteSuggestion | null;
    items: AutocompleteSuggestion[];
    customStyles?: string;
    customMenuStyles?: string;
    customItemStyles?: string;
    initialIsOpen?: boolean;
    initialSelectedIndex?: number;
    selectedItemAddition?: JSX.Element;
    onChange: (changes: Partial<UseComboboxState<AutocompleteSuggestion>>) => void;
    onSelection: (selectedItem: Partial<UseComboboxState<AutocompleteSuggestion>>) => void;
    onInputChange: (selectedItem: Partial<UseComboboxState<AutocompleteSuggestion>>) => void;
    itemToString: (item: AutocompleteSuggestion) => string;
};

const ICONS: Record<AutocompleteSuggestion['type'], JSX.Element | null> = {
    airport: <Airport />,
    city: <City />,
    railway: <Railway />,
    other: null,
};

const SuggestionNameComponent: React.FC<{ suggestion: AutocompleteSuggestion }> = ({ suggestion }): JSX.Element => (
    <>
        {`${suggestion.name} ${suggestion.type === 'airport' && suggestion.iata ? `(${suggestion.iata})` : ''} `}
        <span className={`${BASE_CLASS}__menu-item-text-additional`}>{suggestion.additionalInfo}</span>
    </>
);

export const AutoComplete: React.FC<AutoCompleteProps> = ({
    initialValue,
    isLoading,
    items,
    label,
    customStyles,
    customMenuStyles,
    customItemStyles,
    onChange: handleChange,
    onSelection: handleSelection,
    onInputChange: handleInputChange,
    itemToString: createInputValueFromItem,
}) => {
    if (isLoading) {
        return null;
    }

    const {
        isOpen,
        highlightedIndex,
        getLabelProps,
        getMenuProps,
        getItemProps,
        getInputProps,
        getComboboxProps,
    } = useCombobox({
        items,
        defaultInputValue: initialValue ? createInputValueFromItem(initialValue) : undefined,
        itemToString: createInputValueFromItem,
        onIsOpenChange: handleChange,
        onInputValueChange: handleInputChange,
        onSelectedItemChange: handleSelection,
    });

    const componentClasses = classNames(
        `${BASE_CLASS}`,
        isOpen && `${BASE_CLASS}--open`,
        customStyles && `${customStyles}`,
    );
    const controlClasses = classNames(`${BASE_CLASS}__controls`);
    const listClasses = classNames(`${BASE_CLASS}__menu`, customMenuStyles && `${customMenuStyles}`);
    const listItemClasses = classNames(`${BASE_CLASS}__menu-item`, customItemStyles && `${customItemStyles}`);

    return (
        <div className={`${componentClasses}`}>
            <div className={`${BASE_CLASS}__wrapper`}>
                <div className={`${controlClasses}`}>
                    <label {...getLabelProps()}>{label && label}</label>
                    <div {...getComboboxProps()}>
                        {isLoading ? null : (
                            <input
                                {...getInputProps()}
                                // this will open context menu on mobile - this is default behavior
                                onFocus={(e): void => e.target.select()}
                                className={`${BASE_CLASS}__input`}
                            />
                        )}
                    </div>
                    <ul {...getMenuProps()} className={listClasses}>
                        {isOpen &&
                            items.map((item: AutocompleteSuggestion, index: number) => (
                                <li
                                    className={listItemClasses}
                                    key={`${item}${index}`}
                                    {...getItemProps({ item, index })}
                                >
                                    <p className="flex">
                                        {ICONS[item.type]}
                                        <span
                                            className={
                                                highlightedIndex === index
                                                    ? `${BASE_CLASS}__menu-item-text--selected`
                                                    : ''
                                            }
                                        >
                                            <SuggestionNameComponent suggestion={item} />
                                        </span>
                                    </p>
                                </li>
                            ))}
                    </ul>
                    {/* NOTE: if you Tab from menu, focus goes on button, and it shouldn't. only happens here. */}
                    <div tabIndex={0} />
                </div>
            </div>
        </div>
    );
};
