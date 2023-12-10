import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FilterOption, OfferPackage } from '../../../../domain/Filter';
import { PackageType } from '../../../../domain/OfferPackage';

import Checkbox from '../../../../ui/Checkbox';
import InfoButton from '../../../../ui/InfoButton';

interface ChangeProps extends FilterOption<OfferPackage> {
    readonly className: string;
    readonly isCollapsed: boolean;
}

const Tooltip = ({ type, className }: { type: PackageType; className: string }): JSX.Element => {
    className += '__tooltip';

    return (
        <InfoButton tooltipId={className}>
            <div className={className}>
                <h3 className={classNames(`${className}__title`, `${className}--${type.toLowerCase()}`)}>
                    <FormattedMessage id={`LABEL_PACKAGE_FILTER_HEADER_${type}`} />
                </h3>
                <p className={`${className}__description`}>
                    <FormattedMessage id={`TOOLTIP_PACKAGE_DESCRIPTION_${type}`} />
                </p>
            </div>
        </InfoButton>
    );
};

const InfoCheckbox = ({
    type,
    selected,
    className,
}: {
    className: string;
    selected: FilterOption<OfferPackage>['selected'];
    type: FilterOption<OfferPackage>['value']['type'];
}): JSX.Element => {
    className += '__info';

    return (
        <Checkbox disabled={false} checked={selected === true} onChange={(): void => void 0}>
            <div className={className}>
                <strong className={`${className}__title`}>
                    <FormattedMessage id={`LABEL_PACKAGE_FILTER_HEADER_${type}`} />
                </strong>
            </div>
        </Checkbox>
    );
};

export const Header = ({ value: { type }, isCollapsed, selected, className, disabled }: ChangeProps): JSX.Element => {
    className += '__header';

    return (
        <div
            className={classNames(
                className,
                `${className}--${type.toLowerCase()}`,
                isCollapsed && `${className}--collapsed`,
            )}
        >
            <InfoCheckbox className={className} selected={selected} type={type} />
            {!disabled && <Tooltip type={type} className={className} />}
        </div>
    );
};
