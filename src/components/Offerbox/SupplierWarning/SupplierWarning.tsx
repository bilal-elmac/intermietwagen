import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { Collapse } from '@material-ui/core';
import { ErrorOutline, ExpandMore, ExpandLess, Info } from '@material-ui/icons';

import { Supplier } from '../../../domain/Supplier';
import { PackageType } from '../../../domain/OfferPackage';
import { Price } from '../../../domain/Price';

import { updateFilters } from '../../../reducers/FilterActions';
import { useReduxDispatch, useReduxState } from '../../../reducers/Actions';

import PriceLabel from '../../../ui/PriceLabel';
import { boldFormatter, customButtonFormatter } from '../../../utils/FormatterUtils';
import { isMobile } from '../../../utils/MediaQueryUtils';
import { scrollToTop } from '../../../utils/ScrollUtils';

type Expandable = { readonly open: boolean };
type Expander = { readonly onSelect: () => void };
type Responsive = { readonly isMobileDevice: boolean };
type PriceDisplay = { readonly minPrice: Price };
type SupplierDisplay = { readonly supplier: Supplier };

const AlternativeOfferButton = ({
    minPrice,
    onSelect,
    isMobileDevice,
}: PriceDisplay & Responsive & Expander): JSX.Element => (
    <div className="text-center">
        <button
            className={classnames('bg-blue color-white m-auto p-3 pl-6 pr-6 text-md text-white leading-none flex', {
                'mb-3': isMobileDevice,
            })}
            onClick={onSelect}
        >
            <Info fontSize="inherit" className="mr-1" />
            <FormattedMessage
                id="OFFER_BOX_BAD_SUPPLIER_BUTTON"
                values={{
                    minPrice: (
                        <p className="ml-1">
                            <PriceLabel {...minPrice} alwaysShowDecimals />
                        </p>
                    ),
                    b: boldFormatter,
                }}
            />
        </button>
    </div>
);

const ExpandButton = ({ open, onSelect, isMobileDevice }: Expandable & Responsive & Expander): JSX.Element => (
    <div
        className={classnames({
            'border border-b-0 border-outline': isMobileDevice,
            'ml-auto': !isMobileDevice,
        })}
    >
        <button className={classnames('text-blue', isMobileDevice ? 'h-24' : 'text-sm')} onClick={onSelect}>
            {!isMobileDevice && <FormattedMessage id="WORD_MORE" />}
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </button>
    </div>
);

export const SupplierWarningSection = ({ supplier }: SupplierDisplay): JSX.Element => {
    const dispatch = useReduxDispatch();
    const [open, setOpen] = useState<boolean>(false);

    const excellentPackage = useReduxState(
        state => state.filters.packages.find(filter => filter.value.type === PackageType.EXCELLENT) || null,
    );

    const minPrice = excellentPackage && excellentPackage.prices && excellentPackage.prices[0];

    const onSelect = (): void => {
        if (excellentPackage) {
            scrollToTop(() => dispatch(updateFilters('packages', [{ ...excellentPackage, selected: true }])));
        }
    };

    const isMobileDevice = isMobile();

    return (
        <div
            className={classnames('hc-results-view__supplier-warning block order-10 w-full', {
                'p-2': !isMobileDevice,
            })}
        >
            <div className={classnames('flex', isMobileDevice ? 'leading-tight' : 'leading-none')}>
                {!isMobileDevice && (
                    <div className="mt-auto mb-auto mr-1 text-lg">
                        <ErrorOutline className="text-error align-bottom" fontSize="inherit" />
                    </div>
                )}
                <p className={classnames('mb-auto mt-auto text-sm', { 'p-2': isMobileDevice })}>
                    {isMobileDevice && (
                        <span className="mt-auto mb-auto mr-1 text-lg">
                            <ErrorOutline className="text-error align-bottom" fontSize="inherit" />
                        </span>
                    )}
                    <b className="text-error mr-1">{supplier.name}</b>
                    <FormattedMessage
                        id="OFFER_BOX_BAD_SUPPLIER_SUMMARY"
                        values={{
                            button: excellentPackage
                                ? customButtonFormatter({
                                      className: 'text-green underline',
                                      onClick: onSelect,
                                  })
                                : boldFormatter,
                            b: boldFormatter,
                        }}
                    />
                </p>
                <ExpandButton open={open} onSelect={(): void => setOpen(!open)} isMobileDevice={isMobileDevice} />
            </div>
            <Collapse in={open}>
                <div
                    className={classnames('expandable-panel bg-white pb-3 pl-4 pr-4 pt-3', { 'm-3': !isMobileDevice })}
                >
                    <h4 className="font-semibold mb-1 text-grey text-sm underline">
                        <FormattedMessage id="OFFER_BOX_BAD_SUPPLIER_TITLE" values={{ supplier: supplier.name }} />
                    </h4>
                    <p className="leading-none leading-relaxed text-grey text-xs whitespace-pre">
                        <FormattedMessage id="OFFER_BOX_BAD_SUPPLIER_EXPLANATION" />
                    </p>
                </div>
                {minPrice && (
                    <AlternativeOfferButton isMobileDevice={isMobileDevice} minPrice={minPrice} onSelect={onSelect} />
                )}
            </Collapse>
        </div>
    );
};
