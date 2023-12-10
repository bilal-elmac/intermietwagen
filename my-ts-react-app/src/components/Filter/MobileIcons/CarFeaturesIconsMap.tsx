import React from 'react';
import { CarFeatureType } from '../../../domain/Filter';
import * as MobileIcons from '../../../ui/IconsCarFeatures';
import IconTransmission from '../../../ui/IconTransmission';
import IconAc from '../../../ui/IconAC';

export const CarFeaturesIcons: Record<CarFeatureType, JSX.Element | null> = {
    AIR_CONDITIONER: <IconAc />,
    WINTER_TIRES: <MobileIcons.IconWintertires />,
    AUTOMATIC: <IconTransmission gearType={'automatic'} />,
    FOUR_WHEELS: <MobileIcons.IconFourWheel />,
    DIESEL: <MobileIcons.IconDiesel />,
    FULL_TO_FULL_FUEL_POLICY: <MobileIcons.IconFuelF2F />,
    ADDITIONAL_DRIVER: <MobileIcons.IconAdditionalDriver />,
    UNLIMITED_DISTANCE: <MobileIcons.IconUnlimitedMileage />,
    CAR_MODEL_GUARANTEE: null,
    HYBRID: null,
    ELECTRIC: <MobileIcons.IconElectrocar />,
};
