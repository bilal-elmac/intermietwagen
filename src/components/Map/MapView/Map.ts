import React, { useEffect, createRef, ReactNode, useState } from 'react';
import { FitBoundsOptions, latLng } from 'leaflet';
import { ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { Close } from '@material-ui/icons';
import classNames from 'classnames';

import { RVError, RVErrorType } from '../../../domain/Error';
import { selectStations, hasActiveStations, hasSelectedStations, AvailableStation } from '../MapDomain';

import { updateFilters } from '../../../reducers/FilterActions';
import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';

import { useServices } from '../../../state/Services.context';
import { useStationsListOpener, useStation, useStationsType, useMap } from '../Map.context';

import Button from '../../../ui/Button';
import PulseLoader from '../../../ui/PulseLoader';
import { SelectAllStationsBtn } from '../SelectAllStations';

import UnexpectedErrorWrapper from '../../UnexpectedErrorWrapper';
import { MapNotification } from '../MapNotification';
import { Markers } from '../Markers/Markers';
import { NextStepButton } from '../NextStepButton';
import { NavigationButtons } from '../NavigationButtons';
import { Popup } from '../Popup/Popup';
import StationsList from '../OneWay/StationsList';

import { ExtendedLeafletMap, ConfiguredTileLayer } from './Utilts';
import { extendWithOffset } from './BoundUtilts';
import { isMobile } from '../../../utils/MediaQueryUtils';
import { scrollTo } from '../../../utils/ScrollUtils';
import { preventUntil } from '../../../utils/ThrottleUtils';

interface Props {
    readonly closeable?: boolean;
    readonly children?: ReactNode;
}

const BASE_CLASS = 'hc-results-view__map';

/**
 * Ratios of how far on the map
 * the user will initially see/be able to move
 * in relation to where the useful markers are
 */
const INITIAL_BOUND_RATIO_PADDING = 0.1;
const MAX_BOUND_RATIO_PADDING = 2;

/**
 * Defautls to 1 usually, with this low value, there will be no "zoom" slughshness
 */
const ZOOM_SNAP = 0.1;

/**
 * At the initial render, the map will trigger a moveend event that should be ignored
 */
const USER_INTERACTION_PREVENTION_TIMOUT = 500;

/**
 * When internally changing bounds on the map, it should not put the bounds within the padding region below (in px)
 */
const BOUNDS_PIXEL_PADDING: FitBoundsOptions = { paddingTopLeft: [20, 140], paddingBottomRight: [20, 100] };

export const ReducedMap = ({ closeable, children }: Props): JSX.Element | null => {
    /**
     * App and map control
     */
    const dispatch = useReduxDispatch();
    const { loggerService, analyticsService } = useServices();
    const [isMapOpen, openMap] = useMap();
    const loadMapData = useReduxState(s => s.loadMapData);

    /**
     * Stations control
     */
    const [focusedStationId, focusStation, unfocusStation] = useStation();
    const [stationsType, switchStationsType] = useStationsType();
    const stationsListOpener = useStationsListOpener();
    const activeStationsFlag = hasActiveStations();
    const selectedStationsFlag = hasSelectedStations();
    const { available, allBounds, availableBounds, isOneWay, loaded } = selectStations(stationsType);

    /**
     * Other hooks
     */
    const isMobileFlag = isMobile();
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const wrapperRef = createRef<HTMLDivElement>();

    /**
     * Aux variables
     */
    const focusedStation = available.find(s => s.id === focusedStationId) || null;
    const focus = focusedStation ? latLng(focusedStation.lat, focusedStation.lng) : undefined;
    const bounds = availableBounds && extendWithOffset(availableBounds).pad(INITIAL_BOUND_RATIO_PADDING);

    /**
     * Focus on the map if the user ever clicks on it
     */
    useEffect(() => {
        if (focusedStationId && wrapperRef.current) {
            scrollTo('vertical', wrapperRef.current, { inline: 'center' });
        }
    }, [wrapperRef.current, focusedStationId]);

    /**
     * Trigger to request data from backend if it hasn't requested yet
     */
    useEffect(() => {
        if (isMapOpen && !loadMapData) {
            openMap(true);
        }
    }, [isMapOpen, loadMapData]);

    if (!isMapOpen || !allBounds || !availableBounds || !bounds || isOneWay === null) {
        return null;
    }

    const selectStation = (stations: AvailableStation[], selected: boolean): void => {
        const isDropOffStation = stationsType === 'dropOff';
        if (!showUpdateNotification) {
            setShowUpdateNotification(true);
        }

        dispatch(
            updateFilters(
                isDropOffStation ? 'dropOffStations' : 'pickUpStations',
                stations.map(({ option }) => ({ ...option, selected })),
            ),
        );

        if (isOneWay && !isMobileFlag) {
            stationsListOpener({ [stationsType]: true });
        }

        analyticsService.onStationSelected(stationsType, stations.length > 1, isOneWay);
    };

    return (
        <div className={classNames(BASE_CLASS, isOneWay && `${BASE_CLASS}--one-way`)} ref={wrapperRef}>
            {showUpdateNotification && <MapNotification />}
            {/**
             * This is a trick to force the map to re-render
             * everything, and consider the new bounds/center but
             * only if the user swiches between pickup and dropoff
             */}
            {available.length === 0 ? (
                <div className={`${BASE_CLASS}__map-switcher`}>
                    <PulseLoader className="h-full" />
                </div>
            ) : (
                <>
                    <ExtendedLeafletMap
                        className={`${BASE_CLASS}__map-view`}
                        // For when the user chooses a particular station
                        focus={focus}
                        // For when there is nothing selected
                        bounds={bounds}
                        // General max bounds (relevant area)
                        maxBounds={extendWithOffset(allBounds).pad(MAX_BOUND_RATIO_PADDING)}
                        zoomControl={false}
                        zoomSnap={ZOOM_SNAP}
                        boundsPadding={BOUNDS_PIXEL_PADDING}
                        onUserInteraction={preventUntil(unfocusStation, USER_INTERACTION_PREVENTION_TIMOUT)}
                    >
                        <ConfiguredTileLayer />
                        <Control position="topright">
                            {closeable ? (
                                <Button
                                    id={`${BASE_CLASS}__button-close`}
                                    name={`${BASE_CLASS}__button-close`}
                                    className={`${BASE_CLASS}__button-close`}
                                    onClick={(): void => openMap(!isMapOpen)}
                                >
                                    <Close />
                                </Button>
                            ) : null}
                        </Control>
                        <Control position="topleft">
                            <NavigationButtons
                                stationArrivalType={stationsType}
                                switchStationsType={switchStationsType}
                                isOneWay={isOneWay}
                                hasActiveStations={loaded ? activeStationsFlag : { pickUp: false, dropOff: false }}
                                hasSelectedStations={selectedStationsFlag}
                            />
                        </Control>
                        <SelectAllStationsBtn stations={available} stationType={stationsType} />
                        <ZoomControl position="bottomright" />
                        <UnexpectedErrorWrapper
                            boundaryName="MarkersMapBoundary"
                            loggerService={loggerService}
                            render={(error: unknown): JSX.Element => {
                                if (error) {
                                    loggerService.error(
                                        new RVError(
                                            RVErrorType.UNEXPECTED_STATE,
                                            'There was an issue with rendering the map markers',
                                            { error },
                                        ),
                                    );
                                }

                                return (
                                    <Markers
                                        // Just don't cluster if there is an error
                                        cluster={!error}
                                        stations={available}
                                        onClick={(station): void => {
                                            focusedStationId === station.id
                                                ? unfocusStation()
                                                : focusStation(station.id, station.interactionType);
                                        }}
                                        boundsPadding={BOUNDS_PIXEL_PADDING}
                                        onSelect={(stations, selected): void => selectStation(stations, selected)}
                                    />
                                );
                            }}
                        />

                        {focusedStation && (
                            <Popup
                                {...focusedStation}
                                onSelect={(): void => {
                                    selectStation([focusedStation], true);
                                    unfocusStation();
                                }}
                                onClose={unfocusStation}
                            />
                        )}
                        <Control position="bottomleft">
                            <NextStepButton
                                isOneWay={isOneWay}
                                stationsType={stationsType}
                                switchStationsType={switchStationsType}
                                baseClass={BASE_CLASS}
                                disabled={isOneWay && !loaded ? activeStationsFlag.dropOff : !loaded}
                            />
                        </Control>
                        {/* Here for testings purposes */}
                        {children}
                    </ExtendedLeafletMap>
                    {isOneWay && (
                        <div className="container relative">
                            <div className={`${BASE_CLASS}__lists-container`}>
                                <StationsList type="pickUp" />
                                <StationsList type="dropOff" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
