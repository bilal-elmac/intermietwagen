import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import NavigationButton from '../../../ui/NavigationButton';

interface Props {
    readonly open: boolean;
    readonly backLabel: string;
    readonly children: React.ReactChild | React.ReactChild[];
    readonly handleChange: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

export const MobileHeaderWrapper = ({ children, open, handleChange, backLabel }: Props): JSX.Element => {
    return (
        <>
            <Drawer anchor="top" open={open} onClose={handleChange} className="hc-results-view__mobile-search">
                <NavigationButton title={backLabel} onClick={handleChange} />
                {children}
            </Drawer>
        </>
    );
};
