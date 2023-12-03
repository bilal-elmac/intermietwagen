import React from 'react';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

import FilterView from '../Filter';
import { ResponsiveFilterWrapper } from '../Filter/ResponsiveWrapper';
import ResultsView from '../Results';
import { PackagesUIStateProvider } from '../../state/Packages.context';

export const Content: React.FC<{}> = () => {
    const isMobileDevice = isTabletOrSmaller();
    return (
        <PackagesUIStateProvider>
            <div className="hc-results-view__content">
                <div className="container">
                    <div className="flex flex-wrap overflow-hidden lg:-mx-5 xl:-mx-5">
                        {isMobileDevice ? (
                            <ResponsiveFilterWrapper>
                                <FilterView />
                            </ResponsiveFilterWrapper>
                        ) : (
                            <FilterView />
                        )}
                        <ResultsView />
                    </div>
                </div>
            </div>
        </PackagesUIStateProvider>
    );
};
