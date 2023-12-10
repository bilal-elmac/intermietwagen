import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { SvgIcon, SvgIconProps } from '@material-ui/core';
import { ChevronRightRounded, Place, ExpandMore } from '@material-ui/icons';

import { useReduxDispatch } from '../../../../reducers/Actions';
import { startNewSearch } from '../../../../reducers/SearchActions';

import ReturnSelection from '../../../ReturnSelection';
import AgeSelectionComponent from '../../../AgeSelection';
import Button from '../../../../ui/Button';
import InfoButton from '../../../../ui/InfoButton';
import { LocationSearch } from './LocationSearch';
import { MobileHeaderWrapper } from '../../MobileHeaderWrapper';
import { DateSelection, CalendarIcon, TimeSelection } from '../../../DateTimeSelection';
import { DatePicker } from './DatePicker';

import { DateLabel } from '../../../../ui/DateTimeLabel';

import { useNavigation } from '../../../../state/Navigation.context';
import { useDatePicker } from '../../../../state/DatePicker.context';
import { createNewSearchArgs } from '../../../../state/SearchHelper';

import { scrollToTop } from '../../../../utils/ScrollUtils';

const SearchIcon = (props: SvgIconProps): JSX.Element => (
    <SvgIcon className="hc-results-view__responsive-filter-toggle__icon" {...props}>
        <path
            fill="#FFF"
            fillRule="evenodd"
            d="M2.113 2.11c2.812-2.813 7.389-2.813 10.201 0l.21.218c1.23 1.336 1.904 3.057 1.904 4.883 0 1.412-.407 2.76-1.157 3.916l4.285 4.287c.592.592.592 1.55 0 2.143-.295.295-.683.443-1.07.443-.388 0-.776-.148-1.071-.443l-4.287-4.288c-1.187.767-2.55 1.154-3.914 1.154-1.848 0-3.695-.703-5.101-2.11C.75 10.95 0 9.139 0 7.211 0 5.284.75 3.473 2.113 2.11zm5.1-.046c-1.318 0-2.636.502-3.64 1.506-.972.973-1.508 2.266-1.508 3.641 0 1.376.536 2.669 1.508 3.641 1.976 1.977 5.17 2.004 7.184.089.03-.034.052-.07.083-.102.032-.032.069-.055.103-.083.914-.962 1.42-2.213 1.42-3.545 0-1.375-.536-2.668-1.508-3.641C9.85 2.566 8.532 2.064 7.214 2.064z"
        />
    </SvgIcon>
);

export const Overview: React.FC<{}> = () => {
    const [navigationState, updateNavigationState] = useNavigation();
    const [datepickerState] = useDatePicker();
    const {
        submittedSelection: { start, end },
    } = datepickerState;

    const [state, setState] = useState({
        dropoff: false,
        pickup: false,
        pickupDateSelection: false,
        dropoffDateSelection: false,
        ageSelection: false,
    });

    const dispatch = useReduxDispatch();

    const toggleDrawer = (type: keyof typeof state, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ): void => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [type]: open });
    };

    const onSearchButtonClick = (): void => {
        updateNavigationState({
            type: 'SET_OVERLAY_VISIBILITY',
            payload: !navigationState.isOpen,
        });

        const searchArgs = createNewSearchArgs(navigationState, datepickerState);
        if (searchArgs) {
            dispatch(startNewSearch(searchArgs));
            scrollToTop();
        }
    };

    return (
        <>
            <MobileHeaderWrapper
                open={navigationState.isOpen && !navigationState.isHelpOpen}
                handleChange={(): void =>
                    updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: !navigationState.isOpen })
                }
                backLabel="LABEL_OPEN_SEARCH"
            >
                <div className="hc-results-view__header-searchbar__mobile-drawer flex flex-col bg-light-blue pb-2">
                    <div className="tablet-wrapper w-full hidden h-screen md:block mb-4 md:h-auto">
                        <div className="px-4">
                            <div className="flex ">
                                <h3 className="text-sm text-dark-grey pl-2 py-1 w-1/2">
                                    <FormattedMessage id="LABEL_NAVIGATION_PICKUP" />
                                </h3>
                                {navigationState.isOneWay ? (
                                    <h3 className="text-sm text-dark-grey pl-2 py-1 w-1/2">
                                        <FormattedMessage id="LABEL_NAVIGATION_DROPOFF" />
                                    </h3>
                                ) : null}
                            </div>
                            <div className="autocomplete h-16 border-b border-solid border-outline w-full bg-white mb-3 flex">
                                <div className={`${navigationState.isOneWay ? 'w-1/2' : 'w-full'}`}>
                                    <LocationSearch type="PICKUP" />
                                </div>
                                {navigationState.isOneWay ? (
                                    <>
                                        <ChevronRightRounded className="text-dark-grey mx-1 location-chevron" />
                                        <div className="w-1/2">
                                            <LocationSearch type="DROPOFF" />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            <div className="font-bold text-dark-blue text-sm mb-6">
                                <ReturnSelection />
                            </div>
                            <div className="flex relative">
                                <DateSelection {...datepickerState} />
                            </div>
                            <div className="flex">
                                <div className="w-1/2 ml-auto pl-4">
                                    <div className="driver-age">
                                        <h3 className="text-sm text-dark-grey pl-2 py-1 flex items-center">
                                            <div className="pr-2">
                                                <InfoButton
                                                    tooltipId={`hc-results-view__header-meta-nav__driver-age-tooltip`}
                                                    buttonColor="blue"
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div
                                                        className={`hc-results-view__header-meta-nav__driver-age-tooltip w-56`}
                                                    >
                                                        <p className="text-sm">
                                                            <FormattedMessage id="TOOLTIP_DRIVER_AGE_SELECTION" />
                                                        </p>
                                                    </div>
                                                </InfoButton>
                                            </div>
                                            <FormattedMessage id="LABEL_NAVIGATION_DRIVER_AGE" />
                                        </h3>
                                        <div className="age-selection h-16 border-b border-solid border-outline w-full bg-white p-3">
                                            <AgeSelectionComponent />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hc-results-view__mobile-search__close-button-container md:w-auto bg-white mt-2 p-4 relative">
                            <Button
                                id="hc-results-view__mobile-search__close-button"
                                name="close-mobile-search"
                                onClick={onSearchButtonClick}
                                className="hc-results-view__mobile-search__wrapper__close-button"
                            >
                                <>
                                    <SearchIcon className="mr-1" />
                                    <FormattedMessage id="LABEL_TRIGGER_SEARCH" />
                                </>
                            </Button>
                        </div>
                    </div>
                    <div className="block md:hidden h-screen">
                        <div className="pickup">
                            <h3 className="text-sm text-dark-grey pl-2 py-1">
                                <FormattedMessage id="LABEL_NAVIGATION_PICKUP" />
                            </h3>
                            <div
                                className="pickup-autocomplete h-16 border-b border-solid border-outline w-full bg-white flex items-center"
                                onClick={toggleDrawer('pickup', true)}
                            >
                                <Place className="text-blue mx-2" />
                                <p>{navigationState.pickupSelection?.name}</p>
                            </div>
                            {start ? (
                                <div className="pickup-datetime flex flex-row border-b border-solid border-outline relative">
                                    <div
                                        className="h-16 border-r border-solid border-outline w-1/2 bg-white flex items-center"
                                        onClick={toggleDrawer('pickupDateSelection', true)}
                                    >
                                        <CalendarIcon className="text-blue mx-2" />
                                        <p>
                                            <DateLabel value={start} />
                                        </p>
                                    </div>
                                    <div className="h-16 w-1/2 bg-white">
                                        <TimeSelection type="PICKUP" />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className="font-bold text-dark-blue text-sm m-2 mb-6">
                            <ReturnSelection />
                        </div>
                        <div className="dropoff">
                            <h3 className="text-sm text-dark-grey pl-2 py-1">
                                <FormattedMessage id="LABEL_NAVIGATION_DROPOFF" />
                            </h3>
                            {navigationState.isOneWay ? (
                                <div
                                    className="dropoff-autocomplete h-16 border-b border-solid border-outline w-full bg-white flex items-center"
                                    onClick={toggleDrawer('dropoff', true)}
                                >
                                    <Place className="text-blue mx-2" />
                                    <p>{navigationState.dropoffSelection?.name}</p>
                                </div>
                            ) : null}
                            <div className="dropoff-datetime flex flex-row border-b border-solid border-outline relative">
                                {end ? (
                                    <>
                                        <div
                                            className="h-16 border-r border-solid border-outline w-1/2 bg-white flex items-center"
                                            onClick={toggleDrawer('dropoffDateSelection', true)}
                                        >
                                            <CalendarIcon className="text-blue mx-2" />
                                            <p>
                                                <DateLabel value={end} />
                                            </p>
                                        </div>
                                        <div className="h-16 w-1/2 bg-white">
                                            <TimeSelection type="DROPOFF" />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="map"></div>
                        <div className="driver-age">
                            <h3 className="text-sm text-dark-grey pl-2 py-1">
                                <FormattedMessage id="LABEL_NAVIGATION_DRIVER_AGE" />
                            </h3>
                            <div
                                className="h-16 border-b border-solid border-outline w-full bg-white p-3"
                                onClick={toggleDrawer('ageSelection', true)}
                            >
                                <div className="hc-dropdown flex items-center justify-between">
                                    <span>
                                        {navigationState.ageSelection?.ageRange.join('-')}{' '}
                                        <FormattedMessage id={'LABEL_DRIVER_AGE'} />
                                    </span>
                                    <ExpandMore className="text-blue" fontSize="small" />
                                </div>
                            </div>
                        </div>
                        <div className="hc-results-view__mobile-search__close-button-container md:w-auto bg-white mt-2 px-4">
                            <Button
                                id="hc-results-view__mobile-search__close-button"
                                name="close-mobile-search"
                                onClick={onSearchButtonClick}
                                className="hc-results-view__mobile-search__wrapper__close-button"
                            >
                                <>
                                    <SearchIcon className="mr-1" />
                                    <FormattedMessage id="LABEL_TRIGGER_SEARCH" />
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </MobileHeaderWrapper>
            <MobileHeaderWrapper
                open={state['pickup']}
                handleChange={toggleDrawer('pickup', false)}
                backLabel="LABEL_NAVIGATION_PICKUP"
            >
                <LocationSearch type="PICKUP" />
            </MobileHeaderWrapper>
            <MobileHeaderWrapper
                open={state['dropoff']}
                handleChange={toggleDrawer('dropoff', false)}
                backLabel="LABEL_NAVIGATION_DROPOFF"
            >
                <LocationSearch type="DROPOFF" />
            </MobileHeaderWrapper>
            <MobileHeaderWrapper
                open={state['pickupDateSelection']}
                handleChange={toggleDrawer('pickupDateSelection', false)}
                backLabel="LABEL_NAVIGATION_PICKUP_DATE"
            >
                <DatePicker />
            </MobileHeaderWrapper>
            <MobileHeaderWrapper
                open={state['dropoffDateSelection']}
                handleChange={toggleDrawer('dropoffDateSelection', false)}
                backLabel="LABEL_NAVIGATION_DROPOFF_DATE"
            >
                <DatePicker />
            </MobileHeaderWrapper>
            <MobileHeaderWrapper
                open={state['ageSelection']}
                handleChange={toggleDrawer('ageSelection', false)}
                backLabel="LABEL_OPEN_SEARCH"
            >
                <div className="hc-results-view__header-searchbar__mobile-drawer flex flex-col bg-light-blue pb-2 h-screen md:h-auto">
                    <div className="age-selection h-16 border-b border-solid border-outline w-full bg-white flex items-center justify-center">
                        <AgeSelectionComponent initialIsOpen={true} />
                    </div>
                </div>
            </MobileHeaderWrapper>
        </>
    );
};
