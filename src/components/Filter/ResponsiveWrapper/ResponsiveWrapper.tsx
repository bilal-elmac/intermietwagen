import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { SvgIcon, SvgIconProps } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';

import { offersAmount as selectOffersAmount } from '../../../domain/AppState';

import { isMobile } from '../../../utils/MediaQueryUtils';

import MobileButton from '../MobileButton';
import NavigationButton from '../../../ui/NavigationButton';
import Button from '../../../ui/Button';

import { useNavigation } from '../../../state/Navigation.context';
import { useReduxState } from '../../../reducers/Actions';

interface Props {
    children: React.ReactChild | React.ReactChild[];
}

const SearchIcon = (props: SvgIconProps): JSX.Element => (
    <SvgIcon className="hc-results-view__responsive-filter-toggle__icon" {...props}>
        <path
            fill="#FFF"
            fillRule="evenodd"
            d="M2.113 2.11c2.812-2.813 7.389-2.813 10.201 0l.21.218c1.23 1.336 1.904 3.057 1.904 4.883 0 1.412-.407 2.76-1.157 3.916l4.285 4.287c.592.592.592 1.55 0 2.143-.295.295-.683.443-1.07.443-.388 0-.776-.148-1.071-.443l-4.287-4.288c-1.187.767-2.55 1.154-3.914 1.154-1.848 0-3.695-.703-5.101-2.11C.75 10.95 0 9.139 0 7.211 0 5.284.75 3.473 2.113 2.11zm5.1-.046c-1.318 0-2.636.502-3.64 1.506-.972.973-1.508 2.266-1.508 3.641 0 1.376.536 2.669 1.508 3.641 1.976 1.977 5.17 2.004 7.184.089.03-.034.052-.07.083-.102.032-.032.069-.055.103-.083.914-.962 1.42-2.213 1.42-3.545 0-1.375-.536-2.668-1.508-3.641C9.85 2.566 8.532 2.064 7.214 2.064z"
        />
    </SvgIcon>
);

export const ResponsiveFilterWrapper = ({ children }: Props): JSX.Element => {
    const [{ isMobileFiltersOpen }, updateNavigation] = useNavigation();
    const isMobileDevice = isMobile();
    const offersAmount = useReduxState(selectOffersAmount);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent): void => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        updateNavigation({ type: 'SET_MOBILE_FILTERS_VISIBILITY', payload: !open });
    };
    const handleFilterNavigationClick = (): void =>
        updateNavigation({ type: 'SET_MOBILE_FILTERS_VISIBILITY', payload: !isMobileFiltersOpen });

    return (
        <>
            <Drawer
                anchor={isMobileDevice ? 'top' : 'left'}
                open={isMobileFiltersOpen}
                onClose={toggleDrawer(isMobileFiltersOpen)}
                className="hc-results-view__mobile-filter"
            >
                <NavigationButton title="LABEL_OPEN_FILTERS" onClick={handleFilterNavigationClick} />
                {children}
                <div className="hc-results-view__mobile-filter__close-button-container md:w-auto">
                    <Button
                        id="hc-results-view__mobile-filter__close-button"
                        name="close-mobile-filters"
                        onClick={handleFilterNavigationClick}
                        className="hc-results-view__mobile-filter__close-button"
                    >
                        <>
                            <SearchIcon className="mr-1" />
                            <FormattedHTMLMessage id="LABEL_OPEN_FILTERS" />
                        </>
                    </Button>
                </div>
            </Drawer>
            {!isMobileFiltersOpen && offersAmount > 0 && (
                <MobileButton offersAmount={offersAmount} onChange={handleFilterNavigationClick} />
            )}
        </>
    );
};
