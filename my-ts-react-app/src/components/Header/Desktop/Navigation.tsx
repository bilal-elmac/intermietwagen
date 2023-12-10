import React from 'react';
import { Backdrop } from '@material-ui/core';

import { useNavigation } from '../../../state/Navigation.context';
import { useDatePicker } from '../../../state/DatePicker.context';
import { MetaNav } from './MetaNav';
import { Search as DesktopSearch } from './Search';

export const DesktopNavigation: React.FC<{}> = () => {
    const [navigationState, setNavigationState] = useNavigation();
    const [datePickerState, setDatePickerState] = useDatePicker();

    return (
        <>
            <Backdrop
                open={navigationState.isOpen || datePickerState.isPickerOpen}
                onClick={(): void => {
                    // close help and calendar on overlay click
                    setDatePickerState({ type: 'SET_CALENDAR_VISIBILITY', payload: false });
                    setNavigationState({ type: 'SET_HELP_VISIBILITY', payload: false });
                }}
            />
            <MetaNav />
            <DesktopSearch {...datePickerState} />
        </>
    );
};
