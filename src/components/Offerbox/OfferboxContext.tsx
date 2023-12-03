import React, { useState, useContext, createContext, ReactNode } from 'react';

export enum ViewOfferState {
    INITIAL = 1,
    LOADING = 2,
    LOADED = 3,
}

type Dispatch = (tab: ViewOfferState) => void;
type OfferBoxStatusProps = { children: ReactNode; intialStatus: ViewOfferState };

const StateContext = createContext<ViewOfferState | undefined>(undefined);
const DipatchContext = createContext<Dispatch | undefined>(undefined);

export const OfferboxProvider = ({ children }: OfferBoxStatusProps): JSX.Element => {
    const [status, setStatus] = useState<ViewOfferState>(ViewOfferState.INITIAL);

    // transition to make the btns appear smoothly
    const transformStatus = (status: ViewOfferState): void => {
        if (status === ViewOfferState.LOADING) {
            setStatus(ViewOfferState.LOADING);
            setTimeout(() => setStatus(ViewOfferState.LOADED), 500);
        }
    };

    return (
        <StateContext.Provider value={status}>
            <DipatchContext.Provider value={transformStatus}>{children}</DipatchContext.Provider>
        </StateContext.Provider>
    );
};

const useOfferboxStatus = (): ViewOfferState => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useOfferboxStatus must be used within a OfferboxProvider');
    }
    return context;
};

const useOfferboxSetStatus = (): Dispatch => {
    const context = useContext(DipatchContext);

    if (context === undefined) {
        throw new Error('useSetOfferboxStatus must be used within a OfferboxProvider');
    }

    return context;
};

export const useViewOfferStatus = (): [ViewOfferState, Dispatch] => [useOfferboxStatus(), useOfferboxSetStatus()];
