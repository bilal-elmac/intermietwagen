import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Age } from '../../domain/Configuration';

import { useReduxState } from '../../reducers/Actions';
import { useNavigation } from '../../state/Navigation.context';

import InfoButton from '../../ui/InfoButton';
import { DropdownProps } from '../../ui/Dropdown/Dropdown';
import Dropdown from '../../ui/Dropdown';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

export type RentalAgeOptionsType = {
    readonly option: string;
    readonly rentalAges: Age;
};

const mobileAgeDropDownProps = {
    customItemStyles: 'text-sm justify-center',
    // do not close overlay on mobile
    onOpen: (): void => void 0,
    customMenuStyles: 'text-center w-full',
};

const BASE_CLASS = 'hc-results-view__header-meta-nav__driver-age';

const AgeDropdownLabel = (): JSX.Element => (
    <div className="pr-2">
        <InfoButton
            tooltipId={`${BASE_CLASS}-tooltip`}
            buttonColor="blue"
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <div className={`${BASE_CLASS}-tooltip w-56`}>
                <p className="text-sm">
                    <FormattedMessage id="TOOLTIP_DRIVER_AGE_SELECTION" />
                </p>
            </div>
        </InfoButton>
    </div>
);

const AgeDropdown = ({
    items,
    initialSelectedIndex,
    initialIsOpen,
    onChange,
    onOpen,
    ...props
}: DropdownProps<string>): JSX.Element => (
    <Dropdown
        items={items}
        customMenuStyles="text-center p-0"
        customItemStyles="justify-center"
        initialSelectedIndex={initialSelectedIndex}
        initialIsOpen={initialIsOpen || false}
        selectedItemAddition={<FormattedMessage id={'LABEL_DRIVER_AGE'} />}
        onOpen={onOpen}
        onChange={onChange}
        {...props}
    />
);

export const AgeSelectionComponent: React.FC<{ initialIsOpen?: boolean }> = ({ initialIsOpen }) => {
    const [{ ageSelection }, updateNavigationState] = useNavigation();
    const isMobileDevice = isTabletOrSmaller();
    const mobileProps: Partial<DropdownProps<string>> = isMobileDevice ? mobileAgeDropDownProps : {};

    const rentalAges = useReduxState(s => s.dynamicConfiguration && s.dynamicConfiguration.rentalAges);

    const selectedIndex = ageSelection && rentalAges && rentalAges.findIndex(({ id }) => id === ageSelection.id);
    const items: RentalAgeOptionsType[] | null =
        rentalAges && rentalAges.map(item => ({ option: item.ageRange.join('-'), rentalAges: item }));

    if (!items || selectedIndex === null) {
        return null;
    }

    return (
        <div className="flex items-center">
            {!isMobileDevice && <AgeDropdownLabel />}
            <AgeDropdown
                items={items ? items.map((item: RentalAgeOptionsType) => item.option) : []}
                initialSelectedIndex={selectedIndex}
                initialIsOpen={initialIsOpen}
                onOpen={({ isOpen = false }): void =>
                    updateNavigationState({ type: 'SET_OVERLAY_VISIBILITY', payload: isOpen })
                }
                onChange={({ selectedItem = null }): void => {
                    const match = items.find(item => item.option === selectedItem);
                    if (match) {
                        updateNavigationState({ type: 'SET_SELECTED_AGE', payload: match.rentalAges });
                    }
                }}
                {...mobileProps}
            />
        </div>
    );
};
