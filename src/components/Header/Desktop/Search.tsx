import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    ChevronRightRounded as ChevronRightRoundedIcon,
} from '@material-ui/icons';

import { useReduxDispatch } from '../../../reducers/Actions';
import { startNewSearch } from '../../../reducers/SearchActions';

import { useDatePickerDispatch, DatePickerContextState } from '../../../state/DatePicker.context';
import { useNavigation } from '../../../state/Navigation.context';
import { createNewSearchArgs } from '../../../state/SearchHelper';

import SearchComponent from '../../Search';
import { DateSelection } from '../../DateTimeSelection';

import Button from '../../../ui/Button';
import { scrollToTop } from '../../../utils/ScrollUtils';

export const Search: React.FC<DatePickerContextState> = datePickerState => {
    const dispatch = useReduxDispatch();
    const [navigationState, updateNavigationState] = useNavigation();
    const setDatePickerState = useDatePickerDispatch();

    const locationChangeHandler = (isOpen: boolean): void =>
        updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: isOpen });

    const isOpen = navigationState.isOpen || datePickerState.isPickerOpen;

    return (
        <div className="hc-results-view__header-searchbar hidden lg:block">
            <div className="flex items-center w-full h-full">
                <div className="pl-3 border-r-2 flex w-1/2">
                    <SearchComponent type="PICKUP" onChange={locationChangeHandler} />
                    {navigationState.isOneWay && (
                        <>
                            <ChevronRightRoundedIcon />
                            <SearchComponent type="DROPOFF" onChange={locationChangeHandler} />
                        </>
                    )}
                </div>
                <div className="flex pl-4 w-7/12">
                    <DateSelection {...datePickerState} />
                </div>
                <div className="hc-results-view__form__button ml-auto pt-1">
                    <Button
                        id="hc-results-view__form__button"
                        name="submit-search-btn"
                        version="round"
                        iconLeft={
                            isOpen ? (
                                <CloseIcon
                                    onClick={(): void => {
                                        updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: false });
                                        setDatePickerState({ type: 'SET_CALENDAR_VISIBILITY', payload: false });
                                    }}
                                />
                            ) : (
                                <SearchIcon />
                            )
                        }
                        style={{ width: '42px', height: '42px', margin: '0 2px 3px 0' }}
                        onClick={(): void => {
                            if (datePickerState.isPickerOpen) {
                                setDatePickerState({ type: 'SET_OVERLAY_VISIBILITY', payload: false });
                            }

                            if (isOpen) {
                                return;
                            }

                            const searchArgs = createNewSearchArgs(navigationState, datePickerState);

                            if (!searchArgs) {
                                return;
                            }

                            dispatch(startNewSearch(searchArgs));
                            scrollToTop();
                        }}
                    >
                        <span className="hidden">
                            <FormattedMessage id={isOpen ? 'LABEL_CLOSE_DATEPICKER' : 'LABEL_SEARCH_SUBMIT'} />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
