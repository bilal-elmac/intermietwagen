import React, { useState } from 'react';

import { InfoOutlined } from '@material-ui/icons';
import { PopoverOrigin } from '@material-ui/core';

import Tooltip from '../Tooltip';
import TooltipIcon from '../IconTooltip';

interface Args {
    readonly tooltipId: string;
    readonly children: React.ReactChild;
    readonly buttonColor?: string;
    readonly anchorOrigin?: PopoverOrigin;
    readonly transformOrigin?: PopoverOrigin;
    readonly onIconClick?: () => void;
}

export const InfoButton = ({
    tooltipId,
    buttonColor = 'white',
    anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
    },
    children,
    onIconClick,
}: Args): JSX.Element => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <div className="hc-results-view__info-block">
            <Tooltip
                popoverId={tooltipId}
                popoverClassName="font-sans hc-results-view__info-block__popover"
                className="m-auto"
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                content={
                    <div className="hc-results-view__info-block__content">
                        <TooltipIcon className="flex-shrink w-auto mr-3" width="100%" viewBox="0 0 37 40" />
                        {children}
                    </div>
                }
                wrapContent={false}
                onChange={(isOpen): void => setOpen(isOpen)}
            >
                <button
                    id="hc-results-view__info-close-btn"
                    name="info-close-btn"
                    aria-owns={isOpen ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    className="hc-results-view__info-block__close_button"
                    onClick={onIconClick}
                >
                    <InfoOutlined fontSize="inherit" className={buttonColor && `text-${buttonColor}`} />
                </button>
            </Tooltip>
        </div>
    );
};
