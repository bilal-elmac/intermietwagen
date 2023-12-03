import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DivIcon, divIcon } from 'leaflet';

import { AvailableStation } from '../MapDomain';

import { createDivIconOptions, CustomInteractionType } from './IconRenderer';
import Icon from './CustomIcons';

/**
 * Creates the Marker icon (with caching)
 */
export const useMarkerIcon = (
    station: AvailableStation,
    onInteraction: (type: CustomInteractionType) => void,
): DivIcon | null => {
    const [icon, setIcon] = useState<DivIcon | null>(null);
    const intl = useIntl();

    /**
     * This icon creation is a heavy operation, but it doesn't need to happen that often
     */
    useEffect(() => {
        const icon = <Icon type={station.type} price={station.minPrice} checked={station.option.selected === true} />;
        setIcon(divIcon(createDivIconOptions({ icon, intl, onInteraction })));
    }, [station.type, station.minPrice, station.option.selected]);

    return icon;
};
