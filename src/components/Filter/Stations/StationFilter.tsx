import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HighlightOff, Room } from '@material-ui/icons';

import { FilterOption } from '../../../domain/Filter';
import { Place } from '../../../domain/Location';
import { Station, StationInteractionType } from '../../../domain/Station';
import { SearchParameters, Time, Suggestion } from '../../../domain/SearchParameters';

import { CollapsableFilter } from '../Panel';
import SelectedFilters from '../Selected';
import { DateLabel, TimeLabel } from '../../../ui/DateTimeLabel';
import PriceLabel from '../../../ui/PriceLabel';

interface ActionsProps<T> {
    readonly onRemove: (station: T) => void;
    readonly onReset: (type: StationInteractionType) => void;
}

export const StationOption = ({
    station,
    onRemove,
}: { station: FilterOption<Station> } & Pick<ActionsProps<void>, 'onRemove'>): JSX.Element => (
    <>
        <hr className="text-outline" />
        <div className="bg-white p-3 flex items-center">
            <Room className="text-green" />
            <div className="ml-2 mr-auto pr-2">
                <p className="text-sm font-semibold text-dark-grey mx-0">
                    <FormattedMessage id="LABEL_RENTAL_STATION_NAME" />
                </p>
                <p className="text-sm text-dark-grey mx-0">{station.value.locationName}</p>
            </div>
            <div className="flex flex-col-reverse justify-between items-end">
                {station.prices[0] && (
                    <small className="lowest-price">
                        <FormattedMessage
                            id="LABEL_MINIMALIST_PRICE_FROM"
                            values={{ price: <PriceLabel {...station.prices[0]} alwaysHideDecimals /> }}
                        />
                    </small>
                )}
                <HighlightOff fontSize="small" className="text-blue cursor-pointer" onClick={(): void => onRemove()} />
            </div>
        </div>
    </>
);

interface StationOptionsProps {
    readonly type: StationInteractionType;
    readonly titleKey: string;
    readonly stations: FilterOption<Station>[];
    readonly place: Place<string | null> & Time & Suggestion;
}

const StationOptions = ({
    titleKey,
    stations,
    place: { time, locationName, suggestion },
    type,
    onRemove,
    onReset,
}: StationOptionsProps & ActionsProps<FilterOption<Station>>): JSX.Element | null => {
    if (stations.length === 0) {
        return null;
    }

    const iata = suggestion.iata && suggestion.type === 'airport' ? ` (${suggestion.iata})` : '';

    return (
        <CollapsableFilter title={<FormattedMessage id={titleKey} />} expandOnStart={false}>
            <div className="bg-white p-3">
                <p className="text-sm font-semibold text-dark-grey mx-0">{locationName + iata}</p>
                <p className="text-sm text-super-light-grey mx-0">{suggestion.additionalInfo}</p>
                <p className="text-sm font-semibold text-dark-grey mx-0">
                    <DateLabel value={time} year={undefined} month="short" />{' '}
                    <span className="text-super-light-grey">
                        <TimeLabel value={time} />
                    </span>
                </p>
            </div>
            <SelectedFilters onClearAll={(): void => onReset(type)}>
                <FormattedMessage id="LABEL_RESET_STATIONS" />
            </SelectedFilters>
            <>
                {stations.map((station, k) => (
                    <StationOption key={k} station={station} onRemove={(): void => onRemove(station)} />
                ))}
            </>
        </CollapsableFilter>
    );
};

interface StationsFilterProps {
    readonly search: SearchParameters;
    readonly pickupStations: FilterOption<Station>[];
    readonly dropOffStations: FilterOption<Station>[];
}

export const StationsFilter = ({
    pickupStations,
    dropOffStations,
    search,
    onRemove,
    onReset,
}: StationsFilterProps & ActionsProps<FilterOption<Station>>): JSX.Element => (
    <>
        <StationOptions
            type={'pickUp'}
            titleKey="LABEL_PICKUP_STATIONS"
            stations={pickupStations}
            place={search.pickUp}
            onRemove={onRemove}
            onReset={onReset}
        />
        <StationOptions
            type={'dropOff'}
            titleKey="LABEL_RETURN_STATIONS"
            stations={dropOffStations}
            place={search.dropOff}
            onRemove={onRemove}
            onReset={onReset}
        />
    </>
);
