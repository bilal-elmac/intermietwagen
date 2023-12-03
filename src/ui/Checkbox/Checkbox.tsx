import React from 'react';
import classNames from 'classnames';

import { Check, CheckBox } from '@material-ui/icons';

export interface Args {
    readonly className?: string;
    readonly bordered?: boolean;
    readonly checked?: boolean;
    readonly children?: React.ReactChild | React.ReactChild[] | React.ReactNode;
    readonly textSize?: string;
    readonly showFakeCheckbox?: boolean;
    readonly disabled?: boolean;
    readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BASE_CLASS = 'hc-results-view__checkbox';

export const Checkbox = ({
    className,
    checked,
    bordered,
    showFakeCheckbox = true,
    disabled = false,
    textSize = 'text-xs',
    children,
    onChange,
}: Args): JSX.Element => {
    const Icon = checked ? Check : CheckBox;
    return (
        <div className={classNames(BASE_CLASS, className)}>
            <label
                className={classNames(
                    `${BASE_CLASS}__option-description`,
                    disabled && `${BASE_CLASS}__option-description--disabled`,
                    textSize,
                )}
            >
                <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
                {showFakeCheckbox && (
                    <Icon
                        fontSize="small"
                        className={classNames(
                            `${BASE_CLASS}__icon`,
                            bordered ? 'bordered' : 'opaque',
                            disabled && 'disabled',
                            checked && 'selected',
                        )}
                    />
                )}
                {children}
            </label>
        </div>
    );
};
