import React from 'react';
import classNames from 'classnames';

import Button from '../Button';
import IconClose from '../IconClose';

interface ClosableCardProps {
    readonly className?: string;
    readonly size: 'tiny' | 'small' | 'large';
    readonly children: React.ReactNode;
    readonly order?: number;
    readonly noShadow?: boolean;
    readonly buttonType?: 'absolute' | 'right';
    readonly onClose: () => void;
}

const BASE_CLASS = 'hc-results-view__closable-panel';

export const ClosableCard: React.FC<ClosableCardProps> = ({
    order = 0,
    children,
    size,
    className = '',
    buttonType = 'absolute',
    noShadow,
    onClose,
}): JSX.Element | null => {
    if (!children) {
        return null;
    }

    const button = (
        <Button
            id={`${BASE_CLASS}__icon-close`}
            name={`${BASE_CLASS}__icon-close`}
            className={`${BASE_CLASS}__icon-close ${BASE_CLASS}__icon-close--${buttonType}`}
            onClick={onClose}
        >
            <IconClose />
        </Button>
    );

    return (
        <div
            className={classNames(
                BASE_CLASS,
                `${BASE_CLASS}--${size}`,
                !noShadow && `${BASE_CLASS}--shadow`,
                className,
            )}
            style={{ order }}
        >
            {buttonType === 'absolute' && button}
            {children}
            {buttonType === 'right' && button}
        </div>
    );
};
