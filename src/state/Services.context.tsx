import React from 'react';

import { Services } from '../services';

type StateServices = Pick<
    Services,
    'urlSerializer' | 'analyticsService' | 'loggerService' | 'bannersPersistence' | 'trackingService'
>;
type ServicesProviderProps = StateServices & { readonly children: React.ReactNode };

const ServicesContext = React.createContext<StateServices | undefined>(undefined);

const ServicesProvider = ({ children, ...services }: ServicesProviderProps): JSX.Element => (
    <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
);

const useServicesState = (): StateServices => {
    const context = React.useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};

const useServices = (): StateServices => useServicesState();

export { ServicesProvider, useServices };
