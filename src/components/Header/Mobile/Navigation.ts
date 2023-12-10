import React from 'react';

import { Backdrop } from '@material-ui/core';

import MobileButton from '../../Filter/MobileButton';
import { Search as MobileSearch } from './Search';
import { Overview as OverviewWrapper } from './Search/Overview';
import { ReducedOpenMapButton } from '../../Map/OpenMapButton/OpenMapButton';
import OrderDropdown from '../../OrderDropdown/OrderDropdown';
import { MobileHeaderWrapper } from '../MobileHeaderWrapper';
import { Map } from '../../Map';

import { useReduxState } from '../../../reducers/Actions';
import { useNavigation } from '../../../state/Navigation.context';
import { useMap } from '../../Map/Map.context';

const Button = (): JSX.Element => {
    const [isMapOpen, openMap] = useMap();
    const [, setNavigationState] = useNavigation();

    return (
        <ReducedOpenMapButton
            onChange={(): void => {
                openMap(!isMapOpen);
                setNavigationState({ type: 'SET_HELP_VISIBILITY', payload: false });
            }}
        />
    );
};

export const MobileNavigation: React.FC<{}> = () => {
    const canSort = useReduxState(s => s.offers.sortableBy && s.offers.sortableBy.length > 1);
    const [isMapOpen, openMap] = useMap();
    const [{ isOpen }, setNavigationState] = useNavigation();

    return (
        <>
            <Backdrop
                open={isOpen}
                // close help on overlay click
                onClick={(): void => setNavigationState({ type: 'SET_HELP_VISIBILITY', payload: false })}
            />
            <MobileSearch />
            <div className="hc-results-view__header-meta__mobile w-full flex h-8 bg-white">
                {canSort ? (
                    <>
                        <div className="w-1/2 md:w-1/4 border-r border-solid border-outline">
                            <Button />
                        </div>
                        <div className="hidden md:block md:w-1/2"></div>
                        <div className="w-1/2 md:w-1/4 md:border-l md:border-solid md:border-outline">
                            <OrderDropdown />
                        </div>
                    </>
                ) : (
                    <div className="border-outline border-r border-solid w-full">
                        <Button />
                    </div>
                )}
            </div>
            <OverviewWrapper />
            <MobileHeaderWrapper
                open={isMapOpen}
                handleChange={(): void => openMap(false)}
                backLabel="LABEL_SELECT_STATION_ON_MAP"
            >
                <MobileButton
                    isShortForm
                    onChange={(): void => setNavigationState({ type: 'SET_MOBILE_FILTERS_VISIBILITY', payload: true })}
                />
                <Map />
            </MobileHeaderWrapper>
        </>
    );
};
