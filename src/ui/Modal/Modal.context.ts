import React, { useState, ReactNode, createContext, useContext } from 'react';

type ModalProviderProps = { readonly children: ReactNode };

const ModalContext = createContext<boolean | undefined>(undefined);
const ModalDispatchContext = createContext<((isModalShowing: boolean) => void) | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps): JSX.Element => {
    const [isShowing, setShow] = useState(false);

    return (
        <ModalContext.Provider value={isShowing}>
            <ModalDispatchContext.Provider value={setShow}>{children}</ModalDispatchContext.Provider>
        </ModalContext.Provider>
    );
};

export const isModalShowing = (): boolean => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('isModalShowing must be used within a ModalProvider');
    }
    return context;
};

export const useModalDisplayDispatch = (): ((isModalShowing: boolean) => void) => {
    const context = useContext(ModalDispatchContext);
    if (context === undefined) {
        throw new Error('useModalDisplayDispatch must be used within a ModalProvider');
    }
    return context;
};
