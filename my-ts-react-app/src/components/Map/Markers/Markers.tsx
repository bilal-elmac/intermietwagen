import React from 'react';
import { DivIcon, FitBoundsOptions, MarkerCluster } from 'leaflet';
import { MarkerProps, Marker as LeaftletMarker } from 'react-leaflet';
import MarkerClusterGroup, { MarkerClusterGroupProps } from 'react-leaflet-markercluster';

import { AvailableStation } from '../MapDomain';

import { useMarkerClustererIcon } from './MarkerClusterIconHelper';
import { useMarkerIcon } from './MarkerIconHelper';
import { useMap, useRaceMapEvent } from '../MapView/Utilts';

type MarkerCustomProps = MarkerProps & { readonly id: string };

const Marker = ({
    station,
    onClick,
    onSelected,
}: {
    station: AvailableStation;
    onClick: () => void;
    onSelected: () => void;
}): JSX.Element | null => {
    const icon = useMarkerIcon(station, (type): void => {
        switch (type) {
            case 'checkboxClick':
                onSelected();
                break;
            case 'iconClick':
                onClick();
                break;
        }
    });

    return (
        icon && <LeaftletMarker<MarkerCustomProps> id={station.id} position={[station.lat, station.lng]} icon={icon} />
    );
};

const MAX_CLUSTER_RADIUS: MarkerClusterGroupProps['maxClusterRadius'] = 100;

export const Markers = ({
    cluster,
    stations,
    onClick,
    onSelect,
    boundsPadding,
}: {
    stations: AvailableStation[];
    cluster: boolean;
    boundsPadding: FitBoundsOptions;
    onClick: (station: AvailableStation) => void;
    onSelect: (stations: AvailableStation[], selected: boolean) => void;
}): JSX.Element => {
    const map = useMap();
    const raceEvent = useRaceMapEvent();
    const [clusterKey, createIcon] = useMarkerClustererIcon(cluster ? stations : null);

    const markers = stations.map(s => (
        <Marker
            key={s.id}
            station={s}
            onClick={(): void => onClick(s)}
            onSelected={(): void => onSelect([s], !s.option.selected)}
        />
    ));

    return createIcon && clusterKey ? (
        <MarkerClusterGroup<MarkerClusterGroupProps>
            // Documentation here https://github.com/yuzhva/react-leaflet-markercluster/issues/115
            key={clusterKey}
            showCoverageOnHover={false}
            removeOutsideVisibleBounds
            chunkedLoading
            zoomToBoundsOnClick={false}
            spiderfyDistanceMultiplier={5}
            maxClusterRadius={MAX_CLUSTER_RADIUS}
            iconCreateFunction={(cluster: MarkerCluster): DivIcon => {
                /**
                 * Get list of ids
                 */
                const ids = cluster
                    .getAllChildMarkers()
                    .map(marker => (marker.options as MarkerCustomProps).id)
                    .sort();

                return createIcon(ids, (type, stations, selected): void => {
                    switch (type) {
                        case 'checkboxClick':
                            onSelect(stations, selected);
                            break;
                        case 'iconClick':
                            if (map.getZoom() === map.getMaxZoom()) {
                                // Already zoomed, do nothing, doing something will sometimes have a bad behaviours on some clusters
                                return;
                            }

                            /**
                             * Zooming with the padding can fail depending on the composition of the markers with-in it (the padding makes no zoom possible)
                             * If after the timeout, the zoom event has not been triggered, then zoom without the padding
                             */
                            raceEvent('movestart zoomstart', 150).catch(() => cluster.zoomToBounds());

                            cluster.zoomToBounds(boundsPadding);
                            break;
                    }
                });
            }}
        >
            {markers}
        </MarkerClusterGroup>
    ) : (
        <>{markers}</>
    );
};
