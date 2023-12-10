import React from 'react';

import { Offer } from '../../../domain/Offer';

import Tooltip from '../../../ui/Tooltip';

interface Props extends Pick<Offer, 'supplier' | 'provider'> {
    readonly offerBoxClass: string;
}

export const SupplierProviderLogos: React.FC<Props> = ({ supplier, provider, offerBoxClass }): JSX.Element | null => {
    const className = `${offerBoxClass}__supplier-provider-info`;

    let name: string | null = null;
    let logoUrl: string | null = null;

    if (supplier) {
        name = supplier.name;
        logoUrl = supplier.logoUrl;
    } else if (provider.logoUrl) {
        name = provider.name;
        logoUrl = provider.logoUrl;
    }

    if (name) {
        if (logoUrl) {
            return (
                <Tooltip content={name} className={className}>
                    <img src={logoUrl} alt={name} />
                </Tooltip>
            );
        }

        return (
            <div className={className}>
                <div className="h-10 py-3 text-center text-xs">{name}</div>
            </div>
        );
    }

    if (logoUrl) {
        return (
            <div className={className}>
                <img src={logoUrl} />
            </div>
        );
    }

    return <div className={className}></div>;
};
