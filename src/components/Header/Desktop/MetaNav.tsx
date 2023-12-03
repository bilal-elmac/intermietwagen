import React from 'react';

import ReturnSelectionComponent from '../../ReturnSelection';
import AgeSelectionComponent from '../../AgeSelection';

export const MetaNav: React.FC<{}> = () => (
    <div className="hc-results-view__header-meta-nav flex items-center md:items-start">
        <div className="hc-results-view__header-meta-nav--left w-3/4 flex items-end">
            <div className="w-2/6">
                <ReturnSelectionComponent />
            </div>
            <div className="w-1/4">
                <AgeSelectionComponent />
            </div>
        </div>
    </div>
);
