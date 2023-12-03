import React from 'react';
import classNames from 'classnames';

export interface InputProps {
    customClassNames?: string;
    customWrapperClassNames?: string;
    icon?: JSX.Element;
    placeholder: string;
    value?: string;
    type: string;
    label?: string;
    htmlFor?: string;
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FormEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    icon,
    placeholder,
    value,
    customClassNames,
    htmlFor,
    label,
    customWrapperClassNames,
    name,
    onChange,
    onFocus,
    onKeyDown,
}) => {
    const wrapperClassnames = classNames('hc-results-view__form__input md:flex items-center', customWrapperClassNames);
    const inputClassnames = classNames(
        'appearance-none block w-full focus:outline-none text-xs md:text-base',
        customClassNames,
    );

    return (
        <div className={wrapperClassnames}>
            {label && (
                <label className="block tracking-wide text-xs font-bold hidden md:block" htmlFor={htmlFor}>
                    {label}
                </label>
            )}
            {icon && <div className="hidden md:block">{icon}</div>}
            <input
                className={inputClassnames}
                type="text"
                placeholder={placeholder}
                value={value}
                id={htmlFor}
                name={name}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

export default Input;
