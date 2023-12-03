import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import { useNavigation } from '../../state/Navigation.context';

import Checkbox from '../../ui/Checkbox';
import Dropdown from '../../ui/Dropdown';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

const options = [
    {
        isOneWay: false,
        label: 'LABEL_SAME_DROPOFF_LOCATION',
    },
    {
        isOneWay: true,
        label: 'LABEL_OTHER_DROPOFF_LOCATION',
    },
];

export const ReturnSelectionComponent = injectIntl(({ intl: { formatMessage } }): JSX.Element | null => {
    const [{ isOneWay }, updateNavigationState] = useNavigation();
    const isMobileDevice = isTabletOrSmaller();

    const localeOptions = options.map(option => formatMessage({ id: option.label }));

    if (isOneWay === null) {
        return null;
    }

    return isMobileDevice ? (
        <div>
            <Checkbox
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    updateNavigationState({
                        type: 'SET_RETURN_SELECTION',
                        payload: e.target.checked,
                    });
                }}
                checked={isOneWay}
                disabled={false}
                bordered
                showFakeCheckbox
            >
                <FormattedMessage id="LABEL_OTHER_DROPOFF_LOCATION" />
            </Checkbox>
        </div>
    ) : (
        <Dropdown
            initialSelectedIndex={options.findIndex(o => o.isOneWay === isOneWay)}
            items={localeOptions}
            onOpen={({ isOpen = false }): void => {
                updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: isOpen });
            }}
            onChange={({ selectedItem = null }): void => {
                updateNavigationState({
                    type: 'SET_RETURN_SELECTION',
                    payload: Boolean(selectedItem && options[localeOptions.indexOf(selectedItem)].isOneWay),
                });
            }}
        />
    );
});
