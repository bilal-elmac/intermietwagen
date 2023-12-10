import React from 'react';
import { Place } from '@material-ui/icons';

import { useReduxDispatch, useReduxState } from '../../reducers/Actions';
import { loadAutocompleteData } from '../../reducers/SearchActions';

import { useNavigation } from '../../state/Navigation.context';

import AutoComplete from '../../ui/Autocomplete';
import { useServices } from '../../state/Services.context';
import PulseLoader from '../../ui/PulseLoader';

export interface SearchComponentProps {
    type: 'PICKUP' | 'DROPOFF';
    onChange?: (isOpen: boolean) => void;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ type, onChange }) => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();
    const [{ pickupSelection, dropoffSelection }, updateNavigationState] = useNavigation();

    const suggestions = useReduxState(s => s.autoComplete.suggestions);
    const selection = type === 'PICKUP' ? pickupSelection : dropoffSelection;

    if (selection === null) {
        return <PulseLoader className="w-full h-8 mr-3" />;
    }

    return (
        <div className="hc-search">
            <div className={`hc-search__location hc-search__location--${type.toLowerCase()}`}>
                {type === 'PICKUP' && <Place className="text-blue mx-2" />}
                <AutoComplete
                    isLoading={selection === null}
                    initialValue={selection}
                    items={suggestions}
                    itemToString={(suggestion): string => suggestion.summary}
                    onInputChange={({ inputValue }): void => {
                        inputValue && dispatch(loadAutocompleteData(inputValue.trim()));
                    }}
                    onChange={({ isOpen = false }): void => onChange && onChange(isOpen)}
                    onSelection={({ selectedItem = null }): void => {
                        updateNavigationState({
                            type: type === 'PICKUP' ? 'SET_PICKUP_SELECTION' : 'SET_DROPOFF_SELECTION',
                            payload: selectedItem,
                        });

                        if (selectedItem) {
                            analyticsService.onAutoCompleteSuggestionSelected(selectedItem);
                        }

                        if (type === 'PICKUP') {
                            analyticsService.onPickUpLocationChange();
                        } else {
                            analyticsService.onDropOffLocationChange();
                        }
                    }}
                />
            </div>
        </div>
    );
};
