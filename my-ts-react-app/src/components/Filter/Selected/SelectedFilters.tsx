import React from 'react';
import { HighlightOff } from '@material-ui/icons';

interface Args {
    onClearAll: () => void;
    children: React.ReactChild;
}

const Button = ({
    className,
    children,
    onClick,
}: {
    onClick: () => void;
    className: string;
    children: React.ReactChild;
}): JSX.Element => (
    <button onClick={(): void => onClick()} className={`${className} flex w-full`}>
        <HighlightOff className="button-icon" fontSize="small" />
        <p className="button-label">{children}</p>
    </button>
);

export const SelectedFilters = ({ onClearAll, children }: Args): JSX.Element => (
    <div className="hc-results-view__selected-filters">
        <Button className="clear-all-button" onClick={onClearAll}>
            {children}
        </Button>
    </div>
);
