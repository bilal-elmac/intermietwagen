import React, { useState, useContext, createContext, ReactNode } from 'react';
import { RentalConditionsPanelTabs } from './Panel';

type Dispatch = (tab: RentalConditionsPanelTabs | null) => void;
type CollapsableSectionProps = { children: ReactNode; intialTab: RentalConditionsPanelTabs | null };

const StateContext = createContext<RentalConditionsPanelTabs | null | undefined>(undefined);
const DipatchContext = createContext<Dispatch | undefined>(undefined);

export const CollapsableSectionProvider = ({ children, intialTab }: CollapsableSectionProps): JSX.Element => {
    const [activeTab, setExpanded] = useState<RentalConditionsPanelTabs | null>(intialTab);

    return (
        <StateContext.Provider value={activeTab}>
            <DipatchContext.Provider value={(tab: RentalConditionsPanelTabs | null): void => setExpanded(tab)}>
                {children}
            </DipatchContext.Provider>
        </StateContext.Provider>
    );
};

const useSelectedTab = (): RentalConditionsPanelTabs | null => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useSelectedTab must be used within a CollapsableSectionProvider');
    }
    return context;
};

const useSelectTab = (): Dispatch => {
    const context = useContext(DipatchContext);

    if (context === undefined) {
        throw new Error('useSelectTab must be used within a CollapsableSectionProvider');
    }

    return context;
};

export const useOfferboxTabs = (): [RentalConditionsPanelTabs | null, Dispatch] => [useSelectedTab(), useSelectTab()];
