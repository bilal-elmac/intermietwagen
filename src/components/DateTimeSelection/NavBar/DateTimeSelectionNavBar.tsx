import React from 'react';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import Button from '../../../ui/Button';

interface CustomNavbarProps {
    onPreviousClick: () => void;
    onNextClick: () => void;
    className: string;
}

export const CustomNavbar = ({ onPreviousClick, onNextClick, className }: CustomNavbarProps): JSX.Element => (
    <div className={`${className}`}>
        <Button
            id={`${className}-prev-button`}
            version="round"
            onClick={(): void => onPreviousClick()}
            name="navbar-prev-btn"
        >
            <NavigateBeforeRoundedIcon fontSize="large" />
        </Button>
        <Button
            id={`${className}-next-button`}
            version="round"
            onClick={(): void => onNextClick()}
            name="navbar-next-btn"
        >
            <NavigateNextRoundedIcon fontSize="large" />
        </Button>
    </div>
);
