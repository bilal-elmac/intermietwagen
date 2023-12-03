import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Vehicle } from '../../../domain/Offer';

import Tooltip from '../../../ui/Tooltip';

interface Props extends Pick<Vehicle, 'name'> {
    readonly offerBoxClass: string;
}

export const CarName: React.FC<Props> = ({ offerBoxClass, name }): JSX.Element => (
    <div className={`${offerBoxClass}__car-name`}>
        <h3>{name}</h3>
        <Tooltip
            className={`${offerBoxClass}__car-name__tooltip`}
            content={<FormattedMessage id="LABEL_OR_SIMILAR_TOOLTIP" />}
        >
            <small>
                <FormattedMessage id="LABEL_OR_SIMILAR_SHORT" />
            </small>
        </Tooltip>
    </div>
);
