import React from 'react';
import { Popover, PopoverProps } from '@material-ui/core';
import classNames from 'classnames';

import { isScrolling } from '../../state/Scrolling.context';

interface Props extends Pick<PopoverProps, 'anchorOrigin' | 'transformOrigin'> {
    readonly popoverId?: string;
    readonly popoverClassName?: string;

    readonly className?: string;
    readonly content: JSX.Element | string | null;
    readonly children: React.ReactNode;
    readonly wrapContent?: boolean;
    readonly onChange?: (isOpen: boolean) => void;
}

export const Tooltip: React.FC<Props> = ({
    popoverId,
    popoverClassName,
    children,
    content,
    className,
    anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    },
    wrapContent = true,
    onChange,
}): JSX.Element => {
    const scrolling = isScrolling();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    if (content === null) {
        return <>{children}</>;
    }

    const setState = (element: HTMLElement | null): void => {
        const hasChanged = element !== anchorEl;
        setAnchorEl(element);
        if (hasChanged && onChange) {
            onChange(Boolean(element));
        }
    };

    return (
        <>
            <div
                className={className}
                aria-owns={anchorEl ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={(event): void => setState(event.currentTarget)}
                onMouseLeave={(): void => setState(null)}
            >
                {children}
            </div>
            {!scrolling && (
                <Popover
                    id={popoverId}
                    className={classNames(
                        'font-sans pointer-events-none border border-solid border-silver',
                        popoverClassName,
                    )}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={(): void => setState(null)}
                    anchorOrigin={anchorOrigin}
                    transformOrigin={transformOrigin}
                    container={anchorEl ? anchorEl.parentElement : document.body}
                    disableRestoreFocus
                >
                    {wrapContent ? <p className="px-3 py-2 text-sm w-auto max-w-xs">{content}</p> : content}
                </Popover>
            )}
        </>
    );
};
