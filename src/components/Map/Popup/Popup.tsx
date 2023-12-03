import React from 'react';
import { Popup as LeaftletPopup } from 'react-leaflet';
import { FormattedMessage } from 'react-intl';

import { StationType } from '../../../domain/Station';
import { AvailableStation } from '../MapDomain';

import Button from '../../../ui/Button';

import { Airport, Railway, City, Ferry, Hotel } from '../../../ui/IconStations';
import PriceLabel from '../../../ui/PriceLabel';

interface Props extends AvailableStation {
    readonly onSelect: () => void;
    readonly onClose: () => void;
}

const Icons: Record<StationType, JSX.Element | null> = {
    airport: <Airport className="align-middle" fontSize="small" viewBox="0 -3 20 20" />,
    railway: <Railway className="align-middle" fontSize="small" viewBox="-2.5 -2 20 20" />,
    city: <City className="align-middle" fontSize="small" viewBox="0 -2 20 20" />,
    ferry: <Ferry className="align-middle" fontSize="small" />,
    hotel: <Hotel className="align-middle" fontSize="small" />,
    unknown: <City className="align-middle" fontSize="small" viewBox="0 -2 20 20" />,
};

export const Popup = ({
    onSelect,
    onClose,
    type,
    lat,
    lng,
    interactionType,
    locationName,
    option: {
        selected,
        prices: [lowestPrice],
    },
}: Props): JSX.Element => (
    <LeaftletPopup
        onClose={onClose}
        closeOnClick={false}
        autoClose={false}
        closeOnEscapeKey={false}
        position={{ lat, lng }}
    >
        <div className="hc-results-view__map__popup-content">
            <div className="hc-results-view__map__popup-content__header">
                {Icons[type]}
                <span className="font-bold pl-1 align-middle truncate">{locationName}</span>
            </div>
            <div className="hc-results-view__map__popup-content__main">
                {lowestPrice && (
                    <p className="hc-results-view__map__popup-content__main__price">
                        <FormattedMessage
                            id="LABEL_MINIMALIST_PRICE_FROM"
                            values={{ price: <PriceLabel {...lowestPrice} /> }}
                        />
                    </p>
                )}

                <Button
                    id="hc-results-view__map__popup-content__main__station-select"
                    name="hc-results-view__map__popup-content__main__station-select"
                    className="hc-results-view__map__popup-content__main__station-select"
                    onClick={(): void => onSelect()}
                    version={selected ? 'disabled' : 'default'}
                >
                    <FormattedMessage
                        id={
                            interactionType === 'pickUp'
                                ? 'LABEL_SELECT_AS_PICKUP_STATION'
                                : 'LABEL_SELECT_AS_DROPOFF_STATION'
                        }
                    />
                </Button>
            </div>
        </div>
    </LeaftletPopup>
);
