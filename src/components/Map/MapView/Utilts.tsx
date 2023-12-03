import React, { useState, useEffect } from 'react';

import { Map, LatLngBounds, LatLng, FitBoundsOptions } from 'leaflet';
import { Map as LeafletMap, TileLayer, MapProps, useLeaflet } from 'react-leaflet';

import { RVError, RVErrorType } from '../../../domain/Error';
import { hasSelectedPackage } from '../../../domain/Filter';

import { useReduxState } from '../../../reducers/Actions';

import { useMap as useMapContext } from '../Map.context';
import { usePackagesUI } from '../../../state/Packages.context';

import { scrollToTop } from '../../../utils/ScrollUtils';

export const ConfiguredTileLayer = (): JSX.Element => {
    const leafletMapAPIKey = useReduxState(state => state.staticConfiguration.leafletMapAPIKey);

    return (
        <TileLayer
            attribution={
                '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
            }
            url={`https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=${leafletMapAPIKey}`}
        />
    );
};

interface CustomMapProps extends Pick<MapProps, 'zoomSnap' | 'zoomControl' | 'className' | 'children' | 'maxBounds'> {
    readonly bounds: Extract<MapProps['bounds'], LatLngBounds>;
    readonly focus: Extract<MapProps['center'], LatLng | undefined>;
    readonly boundsPadding: FitBoundsOptions;
    /**
     * Covers the `onclick`, `onzoomstart`, `onmoveend` events not triggered within ExtendedLeafletMap
     */
    readonly onUserInteraction: () => void;
}

type InternalAux = { isChanging: boolean };

/**
 * Map wrapper with no explicit business rules, but with some helpful behaviours
 */
export const ExtendedLeafletMap = ({
    children,
    bounds,
    focus,
    boundsPadding,
    onUserInteraction,
    ...props
}: CustomMapProps): JSX.Element => {
    const [mapRef, setMap] = useState<Map | null>(null);

    // This handles the first load configuration
    const [initialProps] = useState({ bounds, center: focus });
    const [newBounds, setNewBounds] = useState<LatLngBounds | LatLng | null>(null);
    const [changingInternally] = useState<InternalAux>({ isChanging: true });

    useEffect(() => {
        /**
         * This should only be triggered when new stations are loaded or a switch between tabs happen
         */
        if (mapRef && bounds) {
            setNewBounds(bounds);
        }
    }, [mapRef, bounds && bounds.toBBoxString()]);

    useEffect(() => {
        /**
         * This should only be triggered when a station gets focused
         */
        if (mapRef && focus) {
            setNewBounds(focus);
        }
    }, [mapRef, focus && focus.toBounds(0).toBBoxString()]);

    useEffect(() => {
        if (!mapRef || !newBounds) {
            return;
        }

        let die = false;
        changingInternally.isChanging = true;

        mapRef.once('moveend', () =>
            setTimeout(() => {
                changingInternally.isChanging = false;

                // Bounds were disposed off
                if (!die) {
                    setNewBounds(null);
                }
            }, 500),
        );

        mapRef.fitBounds(
            newBounds instanceof LatLngBounds ? newBounds : newBounds.toBounds(1),
            newBounds instanceof LatLngBounds ? boundsPadding : {},
        );

        return (): void => {
            die = true;
        };
    }, [
        mapRef,
        newBounds &&
            (newBounds instanceof LatLngBounds ? newBounds.toBBoxString() : newBounds.toBounds(0).toBBoxString()),
    ]);

    /**
     * Leaflet has some issues updating event handlers (with other functions with different scope)
     * This makes them only work when NOT being changed with-in the ExtendedLeafletMap, but also make them be updated
     */
    const handler = (): void => {
        if (!changingInternally.isChanging) {
            onUserInteraction();
        }
    };

    return (
        <LeafletMap
            {...initialProps}
            {...props}
            onzoomstart={handler}
            maxZoom={22}
            onclick={handler}
            onmoveend={handler}
            ref={(ref): void => setMap(ref?.contextValue?.map || null)}
        >
            {children}
        </LeafletMap>
    );
};

/**
 * Returns promise, stating if the event passed as an argument was executed within the given timeout
 */
export const useRaceMapEvent = (): ((event: string, timeout: number) => Promise<void>) => {
    const { map } = useLeaflet();

    if (!map) {
        return (): Promise<void> => Promise.reject();
    }

    return (event, timeout): Promise<void> =>
        new Promise((resolve, reject) => {
            map.once(event, () => resolve());
            setTimeout(() => reject(), timeout);
        });
};

export const useMap = (): Map => {
    const { map } = useLeaflet();

    if (!map) {
        throw new RVError(RVErrorType.UNEXPECTED_STATE, 'UseMap called outside of leaflet map');
    }

    return map;
};

/**
 * Map toggler with behavior for packages
 *
 *  Package filter state depends on
 *  1. map getting open/closed (open map -> closed packages)
 *  2. packages getting selected (selected package -> closed packages)
 *  3. manual toggling of packages
 *  *initially packages open for one way/two-ways
 */
export const useMapDesktopToggler = (): ((newMapState: boolean) => void) => {
    const [, openPackageFilter] = usePackagesUI();
    const hasSelectedPackagesFlag = useReduxState(s => hasSelectedPackage(s.filters));

    const [, openMap] = useMapContext();

    return (newMapState): void => {
        openMap(newMapState);
        scrollToTop();

        if (newMapState) {
            return openPackageFilter(false);
        }
        openPackageFilter(!hasSelectedPackagesFlag || newMapState);
    };
};
