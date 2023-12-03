import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Help } from '@material-ui/icons';
import { DriveEta } from '@material-ui/icons';

import IconSeat from '../../../../ui/IconSeat';
import IconBag from '../../../../ui/IconBag';
import IconDoor from '../../../../ui/IconDoor';
import IconTransmission from '../../../../ui/IconTransmission';
import IconAC from '../../../../ui/IconAC';
import { TabProps } from '../Panel';
import { Vehicle } from '../../../../domain/Offer';

interface Props extends TabProps, Vehicle {
    readonly customClassNames?: string;
}

const VehicleDetail = ({
    icon,
    label,
    value,
}: {
    icon: JSX.Element;
    label: string;
    value: React.ReactNode;
}): JSX.Element => (
    <ul>
        <li>{icon}</li>
        <li>
            <FormattedMessage id={label} />
        </li>
        <li>{value}</li>
    </ul>
);

const VehicleDetails: React.FC<Props> = ({
    customClassNames,
    tabLabel,
    category,
    acrissCode,
    seats,
    bags,
    doors,
    gearType,
    hasAC,
}) => {
    const intl = useIntl();

    return (
        <div className={customClassNames}>
            <h2 className="text-xl font-bold mb-4">{intl.formatMessage({ id: tabLabel })}</h2>
            <VehicleDetail
                icon={<DriveEta fontSize="small" />}
                label="LABEL_VEHICLE_CLASS"
                value={<FormattedMessage id={`LABEL_CAR_CATEGORY_${category?.toUpperCase()}`} />}
            />
            {doors && <VehicleDetail icon={<IconDoor />} label="LABEL_DOORS" value={doors} />}
            <VehicleDetail
                icon={<IconAC />}
                label="LABEL_FEATURE_INCL_AIR_CONDITIONING"
                value={<FormattedMessage id="LABEL_FEATURE_INCL_AIR_CONDITIONING_VALUE" values={{ includes: hasAC }} />}
            />
            <VehicleDetail
                icon={<IconTransmission gearType={gearType} />}
                label="LABEL_CAR_SHIFT"
                value={<FormattedMessage id={`LABEL_TRANSMISSION_${gearType.toUpperCase()}`} />}
            />
            {seats && <VehicleDetail icon={<IconSeat />} label="LABEL_SEATS" value={seats} />}
            {bags.min && <VehicleDetail icon={<IconBag />} label="LABEL_NUMBER_SMALL_SUITCASES" value={bags.min} />}
            {bags.max && <VehicleDetail icon={<IconBag />} label="LABEL_NUMBER_LARGE_SUITCASES" value={bags.max} />}
            <VehicleDetail icon={<Help fontSize="small" />} label="LABEL_ACRISS_CODE" value={acrissCode} />
        </div>
    );
};

export default VehicleDetails;
