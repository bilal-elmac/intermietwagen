import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import IconLightbulb from '../../../ui/IconBulb';

interface TitleProps {
    readonly className: string;
    readonly checked: boolean;
    readonly showArrow: boolean;
    readonly onArrowClick: () => void;
}

export const Title = ({ className, showArrow, checked, onArrowClick }: TitleProps): JSX.Element | null => {
    const Arrow = showArrow ? (checked ? ExpandMore : ExpandLess) : null;
    className += '__title';

    return (
        <div className={className}>
            <div className={`${className}__bulb-wrapper`}>
                <IconLightbulb className={`${className}__bulb-wrapper__bulb`} fontSize="large" />
            </div>
            <h1 className={`${className}__text`}>
                <FormattedMessage id="LABEL_PACKAGE_FILTER_TITLE" />
            </h1>
            {Arrow && <Arrow className={`${className}__arrow`} fontSize="large" onClick={onArrowClick} />}
        </div>
    );
};
