import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconSeat from '../../../ui/IconSeat';
import IconBag from '../../../ui/IconBag';
import IconDoor from '../../../ui/IconDoor';
import IconTransmission from '../../../ui/IconTransmission';
import IconAC from '../../../ui/IconAC';
import { Vehicle } from '../../../domain/Offer';

interface Props {
    readonly offerBoxClass: string;
    readonly onCharacteristicsClick: () => void;
}

const Item = ({
    icon,
    children,
}: {
    icon: JSX.Element;
    children: React.ReactChild | React.ReactChild[];
}): JSX.Element => (
    <li>
        <span>
            {icon} <span>{children}</span>
        </span>
    </li>
);

export const VehicleCharacteristics: React.FC<Props & Vehicle> = ({
    seats,
    bags,
    doors,
    gearType,
    hasAC,
    offerBoxClass,
    onCharacteristicsClick,
}): JSX.Element => (
    <div className={`${offerBoxClass}__vehicle-characteristic-list`} onClick={onCharacteristicsClick}>
        <ul>
            {seats && (
                <Item icon={<IconSeat />}>
                    {seats} <FormattedMessage id="LABEL_SEATS" />
                </Item>
            )}
            {bags.max && <Item icon={<IconBag />}>{bags.max}</Item>}
            {doors && (
                <Item icon={<IconDoor />}>
                    {doors} <FormattedMessage id="LABEL_DOORS" />
                </Item>
            )}
            <Item icon={<IconTransmission gearType={gearType} />}>
                <FormattedMessage id={`LABEL_TRANSMISSION_${gearType.toUpperCase()}`} />
            </Item>
            {hasAC && (
                <Item icon={<IconAC />}>
                    <FormattedMessage id="LABEL_FEATURE_INCL_AIR_CONDITIONING" />
                </Item>
            )}
        </ul>
    </div>
);
