import React, { useState } from 'react';

type Dispatch = (isPackagesOpen: boolean) => void;
type PackagesUIStateProviderProps = { readonly children: React.ReactNode };

const PackagesUIStateContext = React.createContext<boolean | undefined>(undefined);
const PackagesUIDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export const PackagesUIStateProvider = ({ children }: PackagesUIStateProviderProps): JSX.Element => {
    // Packages are open by default
    const [arePackagesOpen, setPackagesOpen] = useState<boolean>(true);

    return (
        <PackagesUIStateContext.Provider value={arePackagesOpen}>
            <PackagesUIDispatchContext.Provider value={setPackagesOpen}>{children}</PackagesUIDispatchContext.Provider>
        </PackagesUIStateContext.Provider>
    );
};

const usePackagesUIState = (): boolean => {
    const context = React.useContext(PackagesUIStateContext);
    if (context === undefined) {
        throw new Error('usePackagesUIState must be used within a PackagesUIStateProvider');
    }
    return context;
};

const usePackagesUIDispatch = (): Dispatch => {
    const context = React.useContext(PackagesUIDispatchContext);
    if (context === undefined) {
        throw new Error('usePackagesUIDispatch must be used within a PackagesUIStateProvider');
    }
    return context;
};

export const usePackagesUI = (): [boolean, Dispatch] => [usePackagesUIState(), usePackagesUIDispatch()];
