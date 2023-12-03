import React from 'react';
import { FormattedMessage } from 'react-intl';

import { OfferPackageFeature } from '../../../../domain/OfferPackage';
import { OfferPackage } from '../../../../domain/Filter';

import { sortPackageFeatures } from '../../PackageFeaturesUtils';

import IconAvailability, { AvailabilityStatus } from '../../../../ui/IconAvailability';
import Tooltip from '../../../../ui/Tooltip';

type Props = Pick<OfferPackage, 'features'> & { className: string };

export const Features = ({ className, features }: Props): JSX.Element => (
    <>
        <p className={`${className}__feature-list-title`}>
            <FormattedMessage id="LABEL_PACKAGE_FILTER_GROUP_DESCRIPTION" />
        </p>
        <ul className={`${className}__features-list`}>
            {sortPackageFeatures(Object.values(OfferPackageFeature)).map((feature, k) => {
                const includes = features.includes(feature);
                return (
                    <li key={k} className={`${className}__features-list__item`}>
                        <Tooltip
                            content={
                                <FormattedMessage
                                    id={`LABEL_PACKAGE_FEATURE_${feature}_TOOLTIP`}
                                    values={{ includes }}
                                />
                            }
                        >
                            <IconAvailability
                                customClassNames="flex"
                                status={includes ? AvailabilityStatus.INFO : AvailabilityStatus.WARNING}
                            >
                                <FormattedMessage id={`LABEL_PACKAGE_FEATURE_${feature}`} values={{ includes }} />
                            </IconAvailability>
                        </Tooltip>
                    </li>
                );
            })}
        </ul>
    </>
);
