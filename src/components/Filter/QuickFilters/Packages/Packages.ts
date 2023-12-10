import React from 'react';

import { useReduxState } from '../../../../reducers/Actions';

import { sortPackages } from '../../PackageUtilts';

import { Package } from './Package';

interface PackagesFilterProps {
    readonly className: string;
    readonly checked: boolean;
    readonly bottom: boolean;
    readonly onChange: (selected: boolean) => void;
}

export const PackagesFilter = ({ className, checked, bottom, onChange }: PackagesFilterProps): JSX.Element | null => {
    const packages = sortPackages(
        useReduxState(s => s.filters.packages),
        p => p.value.type,
    );

    className += '__packages-filter';

    return (
        <ul className={className}>
            {packages.map((option, k) => (
                <Package
                    key={k}
                    className={className}
                    packageOffer={option}
                    isCollapsed={checked}
                    bottom={bottom}
                    onChange={onChange}
                />
            ))}
        </ul>
    );
};
