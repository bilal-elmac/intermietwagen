import React, { useEffect } from 'react';

import { useReduxDispatch } from './reducers/Actions';
import { loadDataFromUrl } from './reducers/OnOffLoadingActions';

import Header from './components/Header';
import Content from './components/Content';
import { OneWayMap } from './components/Map';
import Footer from './components/Footer';
import { MapStateProvider } from './components/Map/Map.context';
import SessionTimeout from './components/SessionTimeout';
import Title from './components/Title';
import { SearchErrorModal } from './components/Alert';
import { ModalProvider } from './ui/Modal';
import UnexpectedErrorWrapper from './components/UnexpectedErrorWrapper';

import { useServices } from './state/Services.context';
import { ScrollingProvider } from './state/Scrolling.context';
import { NavigationProvider } from './state/Navigation.context';

export const App: React.FC<{}> = () => {
    const dispatch = useReduxDispatch();
    const { analyticsService, loggerService, trackingService } = useServices();

    useEffect(() => {
        dispatch(loadDataFromUrl());
        analyticsService.onFirstPageLoadEvent();
        trackingService.initialize();
    }, []);

    return (
        <UnexpectedErrorWrapper
            loggerService={loggerService}
            boundaryName="AppBoundary"
            fallback={(clearError): JSX.Element => (
                <ModalProvider>
                    <SearchErrorModal onSearched={clearError} />
                </ModalProvider>
            )}
        >
            <Title />
            <ModalProvider>
                <ScrollingProvider>
                    <div className="hc-results-view bg-whitesmoke font-sans">
                        <NavigationProvider>
                            <MapStateProvider>
                                <Header />
                                <OneWayMap />
                                <Content />
                            </MapStateProvider>
                        </NavigationProvider>
                        <Footer />
                        <SessionTimeout />
                    </div>
                </ScrollingProvider>
            </ModalProvider>
        </UnexpectedErrorWrapper>
    );
};
