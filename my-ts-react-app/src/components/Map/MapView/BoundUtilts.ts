import { useState, useEffect } from 'react';
import { LatLngBounds } from 'leaflet';

import { useMap } from './Utilts';

/**
 * The bounds prop needs an offset so the LeafletMap reads it and not throw a fit
 */
export const extendWithOffset = (bounds: LatLngBounds): LatLngBounds => bounds.extend(bounds.getCenter().toBounds(1));

export const useMapBounds = (): LatLngBounds | null => {
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);
    const map = useMap();

    useEffect(() => {
        const handler = (): void => setBounds(map.getBounds());

        // Add the update handlers
        map.on('moveend', handler).once('layeradd', handler);

        return (): void => {
            // Drop them to cause no leaks
            map.off('moveend', handler);
        };
    }, [map]);

    return bounds;
};
