import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import { StationInteractionType } from '../../../domain/Station';
import { countSelectedStations } from '../MapDomain';

import { useServices } from '../../../state/Services.context';
import { useStationsListOpener, useMapState } from '../Map.context';

import IconAvailability, { AvailabilityStatus } from '../../../ui/IconAvailability';

import { customAnchorFormatter } from '../../../utils/FormatterUtils';
import { isMobile } from '../../../utils/MediaQueryUtils';

export interface NavigationProps {
    readonly stationArrivalType: StationInteractionType;
    readonly switchStationsType: (type: StationInteractionType) => void;
    readonly isOneWay: boolean | null;
    readonly hasActiveStations: Record<StationInteractionType, boolean>;
    readonly hasSelectedStations: Record<StationInteractionType, boolean>;
}

export const NavigationButtons = ({
    stationArrivalType,
    switchStationsType,
    isOneWay,
    hasActiveStations,
    hasSelectedStations,
}: NavigationProps): JSX.Element | null => {
    const { analyticsService } = useServices();
    const countSelectedStationsFlag = countSelectedStations();
    const { isStationsListOpen } = useMapState();
    const stationsListOpener = useStationsListOpener();
    const isMobileFlag = isMobile();

    const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: StationInteractionType): void => {
        // do not change stationArrivalType when click on link
        e.stopPropagation();
        stationsListOpener({ [type]: !isStationsListOpen[type] });
    };

    return (
        <div className="hc-results-view__map__button-wrapper container">
            <ToggleButtonGroup
                className="hc-results-view__map__button-group"
                value={stationArrivalType}
                exclusive
                onChange={(_, value: StationInteractionType | null): void => {
                    if (value) {
                        switchStationsType(value);
                        analyticsService.onMapStationTypeChange(value);
                    }
                }}
            >
                <ToggleButton
                    classes={{
                        root: classNames('hc-results-view__map__button-group__button', isOneWay ? 'w-1/2' : 'w-full'),
                        selected: 'hc-results-view__map__button-group__button--selected',
                        disabled: 'hc-results-view__map__button-group__button--disabled',
                    }}
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    value="pickUp"
                    disabled={!hasActiveStations[stationArrivalType]}
                >
                    {hasSelectedStations['pickUp'] && stationArrivalType === 'dropOff' && !isMobileFlag ? (
                        <IconAvailability customClassNames="mb-1" status={AvailabilityStatus.INFO}>
                            &nbsp;
                        </IconAvailability>
                    ) : null}
                    <FormattedMessage
                        id="LABEL_SELECT_PICKUP_STATION"
                        values={{
                            a: customAnchorFormatter({
                                className: classNames(
                                    stationArrivalType === 'dropOff' ? 'text-blue' : 'text-white',
                                    isOneWay ? 'underline' : '',
                                ),
                                onClick: e => onLinkClick(e, 'pickUp'),
                            }),
                            count: countSelectedStationsFlag.pickUp,
                            isOneWay,
                            isMobile: isMobileFlag,
                        }}
                    />
                </ToggleButton>
                {isOneWay && (
                    <ToggleButton
                        classes={{
                            root: 'hc-results-view__map__button-group__button w-1/2',
                            selected: 'hc-results-view__map__button-group__button--selected',
                            disabled: 'hc-results-view__map__button-group__button--disabled',
                        }}
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        disabled={!hasActiveStations[stationArrivalType]}
                        value="dropOff"
                    >
                        {hasSelectedStations['dropOff'] && stationArrivalType === 'pickUp' && !isMobileFlag ? (
                            <IconAvailability customClassNames="mb1" status={AvailabilityStatus.INFO}>
                                &nbsp;
                            </IconAvailability>
                        ) : null}
                        <FormattedMessage
                            id="LABEL_SELECT_DROPOFF_STATION"
                            values={{
                                a: customAnchorFormatter({
                                    className: classNames(
                                        'inline underline',
                                        stationArrivalType === 'pickUp' ? 'text-blue' : 'text-white',
                                    ),
                                    onClick: e => onLinkClick(e, 'dropOff'),
                                }),
                                count: countSelectedStationsFlag.dropOff,
                                isMobile: isMobileFlag,
                            }}
                        />
                    </ToggleButton>
                )}
            </ToggleButtonGroup>
        </div>
    );
};
