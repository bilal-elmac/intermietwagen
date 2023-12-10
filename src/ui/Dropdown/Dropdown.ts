import React, { ReactText } from 'react';
import { useSelect, UseSelectState } from 'downshift';
import classNames from 'classnames';
import { ExpandMore, ExpandLess, Check } from '@material-ui/icons';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

const BASE_CLASS = 'hc-dropdown';

export type DropdownProps<I> = {
    label?: string;
    items: I[];
    customStyles?: string;
    customButtonText?: string;
    customMenuStyles?: string;
    customItemStyles?: string;
    customControlStyles?: string;
    customButtonRightIcon?: React.ReactChild;
    customOpenIcon?: React.ReactChild;
    customCloseIcon?: React.ReactChild;
    initialIsOpen?: boolean;
    initialSelectedIndex?: number;
    selectedItemAddition?: JSX.Element;
    wrapButtonText?: boolean;
    buttonTextWrapperClassName?: string;
    onChange?: (changes: Partial<UseSelectState<I>>) => void;
    onOpen?: (changes: Partial<UseSelectState<I>>) => void;
};

export const Dropdown = <I extends ReactText>({
    items,
    label,
    customStyles,
    customMenuStyles,
    customItemStyles,
    customControlStyles,
    customButtonRightIcon,
    customButtonText,
    initialSelectedIndex,
    initialIsOpen,
    selectedItemAddition,
    wrapButtonText,
    buttonTextWrapperClassName,
    onChange,
    onOpen,
    customCloseIcon,
    customOpenIcon,
}: DropdownProps<I>): JSX.Element => {
    const { isOpen, selectedItem, getToggleButtonProps, getLabelProps, getMenuProps, getItemProps } = useSelect({
        items,
        initialIsOpen: initialIsOpen,
        initialSelectedItem: initialSelectedIndex ? items[initialSelectedIndex] : items[0],
        onSelectedItemChange: e => onChange && onChange(e),
        onIsOpenChange: e => onOpen && onOpen(e),
    });

    const isMobileDevice = isTabletOrSmaller();

    const componentClasses = classNames(
        `${BASE_CLASS} w-full`,
        isOpen && `${BASE_CLASS}--open`,
        customStyles && `${customStyles}`,
    );
    const controlClasses = classNames(`${BASE_CLASS}__controls`, customControlStyles && `${customControlStyles}`);
    const listClasses = classNames(`${BASE_CLASS}__menu`, customMenuStyles && `${customMenuStyles}`);
    const listItemClasses = classNames(`${BASE_CLASS}__menu-item`, customItemStyles && `${customItemStyles}`);
    const expandIconClasses = `${BASE_CLASS}__expand-icon text-blue`;
    const buttonClasses = classNames('flex items-center', isMobileDevice && 'justify-between w-full');

    const buttonText = (
        <>
            {customButtonText ? customButtonText : selectedItem} {selectedItemAddition && selectedItemAddition}{' '}
        </>
    );

    return (
        <div className={`${componentClasses}`}>
            <div className={`${BASE_CLASS}__wrapper`}>
                <div className={`${controlClasses}`}>
                    <label {...getLabelProps()}>{label}</label>
                    <button {...getToggleButtonProps()} className={buttonClasses}>
                        {customButtonRightIcon}
                        {wrapButtonText ? (
                            <div className={buttonTextWrapperClassName}>{buttonText}</div>
                        ) : (
                            <p>{buttonText}</p>
                        )}
                        {isOpen ? (
                            customCloseIcon ? (
                                customCloseIcon
                            ) : (
                                <ExpandLess className={expandIconClasses} fontSize="small" />
                            )
                        ) : customOpenIcon ? (
                            customOpenIcon
                        ) : (
                            <ExpandMore className={expandIconClasses} fontSize="small" />
                        )}
                    </button>
                    <ul {...getMenuProps()} className={listClasses}>
                        {items.map((item: string | number, index: number) => (
                            <li
                                className={listItemClasses}
                                key={`${item}${index}`}
                                {...getItemProps({ item: item as I, index })}
                            >
                                {selectedItem === item && <Check fontSize="small" />}
                                <span className={selectedItem === item ? 'selected' : ''}>{item}</span>
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
