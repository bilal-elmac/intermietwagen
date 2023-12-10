import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { PackageType } from '../../../domain/OfferPackage';

import InfoButton from '../../../ui/InfoButton';

import { isMobile } from '../../../utils/MediaQueryUtils';

const BACKGROUNDS = new Map<PackageType | null, string>([
    [null, 'bg-white'],
    [PackageType.BASIC, 'bg-grey'],
    [PackageType.GOOD, 'bg-yellow'],
    [PackageType.EXCELLENT, 'bg-green'],
]);

const OfferTagTooltip: React.FC<{ readonly hcPackage: PackageType; readonly offerBoxClass: string }> = ({
    hcPackage,
    offerBoxClass,
}): JSX.Element => {
    offerBoxClass += '__package-information-tooltip';

    return (
        <InfoButton tooltipId={offerBoxClass}>
            <div className={`${offerBoxClass}`}>
                <h3
                    className={classNames(
                        `${offerBoxClass}__title`,
                        `${offerBoxClass}__title--${hcPackage.toLowerCase()}`,
                    )}
                >
                    <FormattedMessage id={`LABEL_PACKAGE_FILTER_HEADER_${hcPackage}`} />
                </h3>
                <p className={`${offerBoxClass}__description`}>
                    <FormattedMessage id={`TOOLTIP_PACKAGE_DESCRIPTION_${hcPackage}`} />
                </p>
            </div>
        </InfoButton>
    );
};

export const OfferTag: React.FC<{ readonly hcPackage: PackageType | null; readonly offerBoxClass: string }> = ({
    hcPackage,
    offerBoxClass,
}): JSX.Element => {
    offerBoxClass += '__package-info';

    return (
        <div className={classNames(offerBoxClass, BACKGROUNDS.get(hcPackage))}>
            {hcPackage && (
                <>
                    <span>
                        <FormattedMessage id={`LABEL_PACKAGE_NAME_${hcPackage}`} values={{ isMobile: isMobile() }} />
                    </span>
                    <OfferTagTooltip offerBoxClass={offerBoxClass} hcPackage={hcPackage} />
                </>
            )}
        </div>
    );
};
