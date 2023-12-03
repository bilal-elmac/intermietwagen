import React, { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { AppState } from './domain/AppState';

import { FirstParameter } from './utils/TypeUtils';

import { ServicesProvider } from './state/Services.context';
import { AirportNamesProvider } from './state/AirportNames';
import { DispatchAction } from './reducers/Actions';

import { Services } from './services';

type ServicesProviderServices = Omit<FirstParameter<typeof ServicesProvider>, 'children'>;
type OtherServices = Pick<Services, 'translationService' | 'trackingService' | 'configuration'>;

type Args = {
    readonly store: Store<AppState, DispatchAction>;
    readonly children: ReactNode;
};

export const AppWrapper = ({
    translationService,
    configuration,
    store,
    children,
    ...services
}: ServicesProviderServices & OtherServices & Args): JSX.Element => (
    <Provider store={store}>
        <AirportNamesProvider translationService={translationService}>
            <IntlProvider locale={configuration.language} messages={configuration.translations}>
                <ServicesProvider {...services}>{children}</ServicesProvider>
            </IntlProvider>
        </AirportNamesProvider>
    </Provider>
);
