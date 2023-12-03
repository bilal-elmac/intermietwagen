import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { DivIcon, divIcon } from 'leaflet';

import { AvailableStation } from '../MapDomain';

import { createDivIconOptions, CustomInteractionType } from './IconRenderer';
import Icon from './CustomIcons';

import { Price } from '../../../domain/Price';
import { StationType } from '../../../domain/Station';

import { Indexed } from '../../../utils/TypeUtils';

const resolveMinPrice = (newPrice: Price, oldPrice: Price | null): Price => {
    if (!oldPrice) {
        return newPrice;
    }

    return newPrice.value < oldPrice.value ? newPrice : oldPrice;
};

const resolveStationType = (newStType: StationType, prevStType: StationType | null): StationType | null =>
    prevStType === newStType || !prevStType ? newStType : 'unknown';

const resolveSelection = (a: boolean | null, b: boolean | null): boolean | null => {
    if (a === b) {
        return a;
    }

    return a === true && b === true;
};

/**
 * Returns to the given group of ids, the relevant props to render the marker
 */
const calculateClusterIconProps = (
    ids: string[],
    stations: Indexed<AvailableStation>,
): { stationType: StationType | null; price: Price | null; selected: boolean | null } =>
    ids.reduce<ReturnType<typeof calculateClusterIconProps>>(
        (reduced, id) => {
            const station = stations[id];
            return !station
                ? reduced
                : {
                      stationType: resolveStationType(station.type, reduced.stationType),
                      price: resolveMinPrice(station.minPrice, reduced.price),
                      selected: resolveSelection(station.option.selected, reduced.selected),
                  };
        },
        { stationType: null, price: null, selected: true },
    );

type MarkerClustererIconInteraction = (
    type: CustomInteractionType,
    stations: AvailableStation[],
    selected: boolean,
) => void;
type IconCreator = (ids: string[], interactionHandler: MarkerClustererIconInteraction) => DivIcon;

/**
 * Creates the Markercluster icon with caching (while handling stations changes in order to workaround react-leaflet-markercluster issues
 */
export const useMarkerClustererIcon = (stations: AvailableStation[] | null): [null, null] | [string, IconCreator] => {
    const intl = useIntl();

    /**
     * This icon creation is a heavy operation, but it doesn't need to happen that often after the first drawings
     */
    const [cachedIcons] = useState<Map<string, DivIcon>>(new Map());

    let clusterKey = '';
    const indexedInformation: Indexed<AvailableStation> = {};
    (stations || []).forEach(station => {
        indexedInformation[station.id] = station;
        clusterKey += station.id + station.option.selected + station.minPrice.value;
    });

    /**
     * Let's clear our cache whenever a minifull change is made
     */
    useEffect(() => cachedIcons.clear(), [clusterKey]);

    if (stations === null) {
        return [null, null];
    }

    return [
        clusterKey,
        (ids, onInteraction): DivIcon => {
            const { stationType, price, selected } = calculateClusterIconProps(ids, indexedInformation);

            /**
             * Warning, this key is very important
             * Collisions might occur in some weird bugs :D
             */
            const cacheKey = [...ids, stationType, selected, price && price.value].join('-');

            /**
             * Consult and use the cache
             */
            let cache;
            if ((cache = cachedIcons.get(cacheKey))) {
                return cache;
            }

            const option = createDivIconOptions({
                icon: (
                    <Icon
                        type={stationType || 'unknown'}
                        price={price}
                        checked={selected === true}
                        childCount={ids.length}
                    />
                ),
                intl,
                onInteraction: type =>
                    onInteraction(
                        type,
                        ids.map(id => indexedInformation[id]),
                        !selected,
                    ),
            });

            const icon = divIcon(option);

            // Cache this element, but WITHOUT re-rendering
            cachedIcons.set(cacheKey, icon);

            return icon;
        },
    ];
};
