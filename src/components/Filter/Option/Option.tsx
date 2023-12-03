import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { PriceRange } from '../../../domain/Price';

import Checkbox, { CheckboxArgs } from '../../../ui/Checkbox';
import PriceLabel from '../../../ui/PriceLabel';

interface Args {
    readonly prices?: PriceRange;
    readonly icon?: JSX.Element | null;
    readonly isSquare?: boolean;
    readonly isListItem?: boolean;
    readonly onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface OptionArgs extends Args {
    readonly checkbox: React.ReactChild | React.ReactChild[];
    readonly disabled?: boolean;
    readonly showIcon?: boolean;
    readonly checked?: boolean;
}

const BASE_CLASS = 'hc-results-view__filter-option';

const Option = ({
    checkbox,
    prices,
    disabled,
    checked = false,
    showIcon = false,
    isSquare = false,
    isListItem = true,
    onClick,
}: OptionArgs): JSX.Element => {
    const className = classNames(
        BASE_CLASS,
        onClick && `${BASE_CLASS}--clickable`,
        disabled && `${BASE_CLASS}--disabled`,
        isSquare && `${BASE_CLASS}--square`,
        showIcon && checked && `${BASE_CLASS}--selected`,
    );

    const children = (
        <>
            {checkbox}
            {prices && prices[0] && (
                <small className="lowest-price">
                    <FormattedMessage
                        id="LABEL_MINIMALIST_PRICE_FROM"
                        values={{ price: <PriceLabel {...prices[0]} alwaysHideDecimals /> }}
                    />
                </small>
            )}
        </>
    );

    const props = { className, onClick, children };
    return isListItem ? <li {...props} /> : <div {...props} />;
};

export const FilterOption = ({
    bordered,
    checked,
    onChange,
    children,
    disabled,
    icon,
    showFakeCheckbox,
    ...args
}: CheckboxArgs & Args): JSX.Element => (
    <Option
        {...args}
        showIcon={Boolean(icon)}
        disabled={disabled}
        checked={checked}
        checkbox={
            <Checkbox
                showFakeCheckbox={showFakeCheckbox}
                checked={checked}
                bordered={bordered}
                disabled={disabled}
                onChange={onChange}
            >
                <>
                    {icon && (
                        <span
                            className={`hc-results-view__mobile-filter-icon-holder${
                                checked ? '--selected' : disabled ? '--disabled' : '--plain'
                            }`}
                        >
                            {icon}
                        </span>
                    )}
                    {children}
                </>
            </Checkbox>
        }
    />
);
