import React from 'react';
import { injectIntl } from 'react-intl';

import { offersAmount as selectOffersAmount } from '../../domain/AppState';
import { SortStatus } from '../../domain/SortStatus';

import { updateSorting } from '../../reducers/FilterActions';
import { useReduxDispatch, useReduxState } from '../../reducers/Actions';

import Dropdown from '../../ui/Dropdown';

const options = [
    {
        value: SortStatus.PRICE_ASC,
        label: 'LABEL_OFFERS_SORT_BY_PRICE',
        selectedLabel: 'LABEL_OFFERS_SORT_BY_PRICE_SELECTED',
    },
    {
        value: SortStatus.SUPPLIER_RATING_DESC,
        label: 'LABEL_OFFERS_SORT_BY_SUPPLIER_RATING',
        selectedLabel: 'LABEL_OFFERS_SORT_BY_SUPPLIER_RATING_SELECTED',
    },
];

const OrderDropdown = injectIntl(({ intl: { formatMessage } }): JSX.Element | null => {
    const dispatch = useReduxDispatch();

    const sorting = useReduxState(state => state.sort);
    const sortableBy = useReduxState(state => state.offers.sortableBy);
    const totalOffersCount = useReduxState(selectOffersAmount);

    const values = options
        .filter(({ value }) => sortableBy !== null && sortableBy.includes(value))
        .map(({ value, label, selectedLabel }) => ({
            value,
            label: formatMessage({ id: label }),
            selectedLabel: formatMessage({ id: selectedLabel }),
        }));

    if (values.length <= 1 || totalOffersCount === 0) {
        return null;
    }

    return (
        <Dropdown
            wrapButtonText
            buttonTextWrapperClassName="button-text"
            customStyles="hc-results-view__order-dropdown"
            customButtonText={values.find(v => v.value === sorting)?.selectedLabel}
            initialSelectedIndex={values.findIndex(v => v.value === sorting)}
            items={values.map(v => v.label)}
            onChange={({ selectedItem }): void => {
                const selected = values.find(({ label }) => label === selectedItem) || null;

                if (selected && selected.value !== sorting) {
                    dispatch(updateSorting(selected.value));
                }
            }}
        />
    );
});

export default OrderDropdown;
