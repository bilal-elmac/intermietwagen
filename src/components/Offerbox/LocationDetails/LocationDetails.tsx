import React, { Fragment, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChevronRightRounded } from '@material-ui/icons';
import classNames from 'classnames';

import { PickupType, OfferPickUpDropOff } from '../../../domain/Offer';
import { StationInteractionType, StationType } from '../../../domain/Station';

import { useRateStationFocus } from '../../Map/Map.context';

import { Shuttle, Airport, Railway, City, Ferry, Hotel } from '../../../ui/IconStations';
import { boldFormatter } from '../../../utils/FormatterUtils';
import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';

type Renderer = (props: { name: string | null; iata: string | null }) => JSX.Element | null;

const createRenderer = (
    icon: JSX.Element,
    pickupType: 'shuttle_from' | 'meet_and_greet_at' | 'pickup_at' | null,
    stationType: 'airport' | 'railway' | 'ferry' | 'hotel' | 'generic',
    preferName?: boolean,
): Renderer => {
    const pickupLabel = pickupType ? `LABEL_${pickupType.toUpperCase()}_PLACE` : null;
    const placeLabel = `LABEL_STATION_TYPE_NAME_${stationType.toUpperCase()}`;

    const renderer: Renderer = ({ name, iata }) => {
        const iataSuffix = iata ? ` (${iata})` : '';
        const place =
            preferName && name ? (
                name
            ) : (
                <Fragment key="pickupPlace">
                    <FormattedMessage id={placeLabel} />
                    {iataSuffix}
                </Fragment>
            );

        return (
            <>
                {icon}
                <span>
                    {pickupLabel ? (
                        <FormattedMessage
                            id={pickupLabel}
                            values={{
                                place,
                                strong: boldFormatter,
                            }}
                        />
                    ) : (
                        <b>{place}</b>
                    )}
                </span>
            </>
        );
    };

    return renderer;
};

const hash = (stationsType: StationType, pickupType: PickupType): string => `${stationsType}_${pickupType}`;

const renderers = new Map<string, Renderer>([
    [hash('unknown', 'unknown'), createRenderer(<City />, null, 'generic', true)],
    [hash('unknown', 'desk_at_place'), createRenderer(<City />, 'pickup_at', 'generic', true)],
    [hash('unknown', 'meet_and_greet'), createRenderer(<City />, 'meet_and_greet_at', 'generic', true)],
    [hash('unknown', 'shuttle'), createRenderer(<Shuttle />, 'shuttle_from', 'generic', true)],

    [hash('airport', 'unknown'), createRenderer(<Airport />, 'pickup_at', 'airport')],
    [hash('airport', 'desk_at_place'), createRenderer(<Airport />, 'pickup_at', 'airport')],
    [hash('airport', 'meet_and_greet'), createRenderer(<Airport />, 'meet_and_greet_at', 'airport')],
    [hash('airport', 'shuttle'), createRenderer(<Airport />, 'shuttle_from', 'airport')],

    [hash('railway', 'unknown'), createRenderer(<Railway />, 'pickup_at', 'railway')],
    [hash('railway', 'desk_at_place'), createRenderer(<Railway />, 'pickup_at', 'railway')],
    [hash('railway', 'meet_and_greet'), createRenderer(<Railway />, 'meet_and_greet_at', 'railway')],
    [hash('railway', 'shuttle'), createRenderer(<Railway />, 'shuttle_from', 'railway')],

    [hash('city', 'unknown'), createRenderer(<City />, 'pickup_at', 'generic', true)],
    [hash('city', 'desk_at_place'), createRenderer(<City />, 'pickup_at', 'generic', true)],
    [hash('city', 'meet_and_greet'), createRenderer(<City />, 'meet_and_greet_at', 'generic', true)],
    [hash('city', 'shuttle'), createRenderer(<Shuttle />, 'shuttle_from', 'generic', true)],

    [hash('ferry', 'unknown'), createRenderer(<Ferry />, 'pickup_at', 'ferry')],
    [hash('ferry', 'desk_at_place'), createRenderer(<Ferry />, 'pickup_at', 'ferry')],
    [hash('ferry', 'meet_and_greet'), createRenderer(<Ferry />, 'meet_and_greet_at', 'ferry')],
    [hash('ferry', 'shuttle'), createRenderer(<Ferry />, 'shuttle_from', 'ferry')],

    [hash('hotel', 'unknown'), createRenderer(<Hotel />, 'pickup_at', 'hotel')],
    [hash('hotel', 'desk_at_place'), createRenderer(<Hotel />, 'pickup_at', 'hotel')],
    [hash('hotel', 'meet_and_greet'), createRenderer(<Hotel />, 'meet_and_greet_at', 'hotel')],
    [hash('hotel', 'shuttle'), createRenderer(<Hotel />, 'shuttle_from', 'hotel')],
]);

export interface Props {
    readonly pickUp: OfferPickUpDropOff['pickUp'];
    readonly dropOff: OfferPickUpDropOff['dropOff'];
    readonly isOneWay: boolean;
    readonly offerBoxClass: string;

    readonly onClick: (stationId: string, type: StationInteractionType) => void;
}

const RendererWrapper = ({
    offerBoxClass,
    id,
    type,
    children,
    onClick,
}: {
    readonly id: string;
    readonly type: StationInteractionType;
    readonly children: ReactNode;
} & Pick<Props, 'onClick' | 'offerBoxClass'>): JSX.Element => {
    offerBoxClass += '__location';

    return (
        <span
            className={`${offerBoxClass} ${offerBoxClass}--${type.toLowerCase()}`}
            onClick={(e: React.MouseEvent<HTMLSpanElement>): void => {
                e.stopPropagation();
                id && onClick(id, type);
            }}
        >
            {children}
        </span>
    );
};

const DropOffRenderer = ({ dropOffName }: { dropOffName: string }): JSX.Element => (
    <FormattedMessage id="LABEL_DROPOFF_AT_PLACE" values={{ place: dropOffName, strong: boldFormatter }} />
);

export const LocationDetails: React.FC<Props> = ({
    pickUp: { iata, stationType, pickupType, locationName: pickUpLocationName, id: pickUpId },
    dropOff: { locationName: dropOffLocationName, id: dropOffId },
    isOneWay,
    offerBoxClass,
    onClick,
}): JSX.Element => {
    offerBoxClass += '__location-details';
    const isMobile = isTabletOrSmaller();
    const PickUpRenderer =
        /**
         * Has information to show
         */
        ((pickUpLocationName || stationType !== 'unknown' || pickupType !== 'unknown') &&
            renderers.get(hash(stationType, pickupType))) ||
        null;
    const dropOffName = (PickUpRenderer && isOneWay && dropOffLocationName) || null;

    return (
        <div
            className={classNames(offerBoxClass, `${offerBoxClass}--${dropOffName ? 'one-way' : 'two-ways'}`)}
            /**
             * propagate the event to parent for mobile & two-ways searches
             * to let the whole address box hit the event instead of the short pickup span element
             */
            onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                if (!dropOffName && isMobile) {
                    e.stopPropagation();
                    onClick(pickUpId, 'pickUp');
                }
            }}
        >
            {PickUpRenderer && (
                <RendererWrapper type="pickUp" offerBoxClass={offerBoxClass} id={pickUpId} onClick={onClick}>
                    <PickUpRenderer name={pickUpLocationName} iata={iata} />
                </RendererWrapper>
            )}
            {PickUpRenderer && dropOffName && <ChevronRightRounded className={`${offerBoxClass}__divider`} />}
            {dropOffName && (
                <RendererWrapper type="dropOff" offerBoxClass={offerBoxClass} id={dropOffId} onClick={onClick}>
                    <DropOffRenderer dropOffName={dropOffName} />
                </RendererWrapper>
            )}
        </div>
    );
};

export const ReducedLocationDetails: React.FC<Omit<Props, 'onClick'>> = (props): JSX.Element => {
    const focusOnStation = useRateStationFocus();
    return <LocationDetails {...props} onClick={focusOnStation} />;
};
