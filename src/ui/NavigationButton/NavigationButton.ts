import React from 'react';
import { KeyboardArrowLeftRounded } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';

interface NavigationButtonProps {
    title: string;
    onClick: (event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => void;
}

export const NavigationButtonComponent: React.FC<NavigationButtonProps> = ({ title, onClick }): JSX.Element => (
    <button className="hc-results-view__navigation-button" onClick={onClick}>
        <KeyboardArrowLeftRounded
            className="hc-results-view__navigation-button__icon"
            htmlColor="#4f4f4f"
            fontSize="large"
        ></KeyboardArrowLeftRounded>
        <span className="hc-results-view__navigation-button__title">
            <FormattedMessage id={title} />
        </span>
    </button>
);
