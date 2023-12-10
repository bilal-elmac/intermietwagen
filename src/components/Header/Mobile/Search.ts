import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { ChevronRight } from '@material-ui/icons';

import { AutocompleteSuggestion } from '../../../domain/Autocomplete';

import { useNavigation } from '../../../state/Navigation.context';
import { useDatePicker } from '../../../state/DatePicker.context';

import { TimeLabel, DateLabel } from '../../../ui/DateTimeLabel';
import PulseLoader from '../../../ui/PulseLoader';
import { LogoNoText } from '../../../ui/Logo';

type PlaceArgs = {
    readonly place: AutocompleteSuggestion;
    readonly time: Date;
};

const Place = ({ place }: { place: PlaceArgs | null }): JSX.Element =>
    place ? (
        <div className="hc-results-view__header-searchbar--mobile__place">
            <p className="truncate">{place.place.summary}</p>
            <p className="text-light-grey truncate">
                <DateLabel value={place.time} />
                &nbsp;
                <TimeLabel value={place.time} />
            </p>
        </div>
    ) : (
        <div className="px-1 w-full">
            <PulseLoader className="h-10 w-full" />
        </div>
    );

export const Search: React.FC<{}> = () => {
    const [{ pickupSelection, dropoffSelection, isOpen }, updateNavigationState] = useNavigation();
    const [{ submittedSelection }] = useDatePicker();
    const { start, end } = submittedSelection;

    const pickUp = pickupSelection && start && { place: pickupSelection, time: start };
    const dropOff = dropoffSelection && end && { place: dropoffSelection, time: end };

    return (
        <div
            className="hc-results-view__header-searchbar--mobile bg-white border-b border-outline flex justify-between p-2 pb-1 w-full"
            onClick={(): void => updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: !isOpen })}
        >
            <div className="pr-2">
                <LogoNoText />
            </div>
            <Place place={pickUp} />
            <ChevronRight className="my-auto w-4" />
            <Place place={dropOff} />
            {pickUp && dropOff ? <SearchIcon className="my-auto text-blue text-right w-4" /> : <div className="w-4" />}
        </div>
    );
};
