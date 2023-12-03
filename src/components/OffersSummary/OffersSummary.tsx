import React from 'react';
import { FormattedMessage } from 'react-intl';

import { offersAmount as selectOffersAmount } from '../../domain/AppState';

import { useReduxState } from '../../reducers/Actions';

import PriceLabel from '../../ui/PriceLabel';
import { boldFormatter } from '../../utils/FormatterUtils';

export const OffersSummary = (): JSX.Element | null => {
    const totalOffersCount = useReduxState(selectOffersAmount);
    const [minPrice, maxPrice] = useReduxState(app => app.offers.prices);

    if ((totalOffersCount || 0) <= 0) {
        return null;
    }

    const minPriceLabel = minPrice && (
        <b>
            <PriceLabel {...minPrice} alwaysHideDecimals />
        </b>
    );

    const maxPriceLabel = maxPrice && (
        <b>
            <PriceLabel {...maxPrice} alwaysHideDecimals />
        </b>
    );

    const priceRange = minPriceLabel && (
        <FormattedMessage
            id={maxPriceLabel ? 'LABEL_MINIMALIST_PRICE_RANGE' : 'LABEL_MINIMALIST_PRICE_FROM'}
            values={
                maxPriceLabel
                    ? {
                          minPrice: minPriceLabel,
                          maxPrice: maxPriceLabel,
                      }
                    : {
                          price: minPriceLabel,
                      }
            }
        />
    );

    return (
        <p className="hc-results-view__offer-summary">
            <FormattedMessage
                id="LABEL_OFFERS_SUMMARY"
                values={{
                    offersCount: totalOffersCount,
                    b: boldFormatter,
                }}
            />{' '}
            {priceRange}
        </p>
    );
};
