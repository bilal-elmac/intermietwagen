import React from 'react';
import classNames from 'classnames';

import './Button.css';

interface ButtonProps {
    id: string;
    children: React.ReactNode | React.ReactNode[];
    className?: string;
    style?: React.CSSProperties;
    iconLeft?: JSX.Element;
    iconRight?: JSX.Element;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'reset' | 'submit';
    version?: 'default' | 'inverted' | 'round' | 'disabled';
    name?: string;
}

const BASE_CLASS = 'hc-results-view__button';

export const Button: React.FC<ButtonProps> = ({
    id,
    children,
    iconLeft,
    iconRight,
    className,
    onClick,
    style,
    type = 'button',
    version = 'default',
    name,
}) => {
    const buttonClassname = classNames(BASE_CLASS, version && `${BASE_CLASS}-${version}`, className && className);
    return (
        <button
            id={id}
            className={buttonClassname}
            onClick={onClick}
            style={style && style}
            name={name || id}
            type={type}
            disabled={version === 'disabled'}
        >
            {iconLeft && iconLeft}
            <span>{children}</span>
            {iconRight && iconRight}
        </button>
    );
};
