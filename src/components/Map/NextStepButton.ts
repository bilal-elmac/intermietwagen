import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ChevronRightRounded } from '@material-ui/icons';

import { StationInteractionType } from '../../domain/Station';
import Button from '../../ui/Button';

import { useServices } from '../../state/Services.context';
import { useMapOpener } from './Map.context';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';
import { scrollTo } from '../../utils/ScrollUtils';
import { useScrollPoints, ScrollMarks } from '../../state/Scrolling.context';

export interface NextStepBtnProps {
    baseClass: string;
    isOneWay: boolean | null;
    stationsType: StationInteractionType;
    disabled: boolean;
    switchStationsType: (type: StationInteractionType) => void;
}

export const NextStepButton = ({
    baseClass,
    isOneWay,
    stationsType,
    disabled,
    switchStationsType,
}: NextStepBtnProps): JSX.Element | null => {
    const openMap = useMapOpener();
    const isInDrawer = isTabletOrSmaller();
    const { analyticsService } = useServices();
    const getScrollPoint = useScrollPoints();
    const step = stationsType === 'pickUp' && isOneWay ? 1 : 2;

    return (
        <Button
            id={`${baseClass}__next-step-btn`}
            name={`${baseClass}__next-step-btn`}
            className={`${baseClass}__next-step-btn rounded font-sans px-4`}
            version={disabled ? 'disabled' : 'default'}
            onClick={(): void => {
                analyticsService.onMapNavigationStepChange(stationsType, step, Boolean(isOneWay));

                if (stationsType === 'pickUp' && isOneWay) {
                    switchStationsType('dropOff');
                    return;
                }

                if (isInDrawer) {
                    openMap(false);
                }

                const elmToScroll = getScrollPoint(ScrollMarks.FIRST_OFFER)?.current;
                if (elmToScroll) {
                    setTimeout(
                        () => {
                            // scroll to first offer
                            scrollTo('toElm', elmToScroll);
                        },
                        isInDrawer ? 10 : 0,
                    );
                }
            }}
        >
            <FormattedMessage id="LABEL_MAP_NEXT_STEP" values={{ step }} />
            <ChevronRightRounded />
        </Button>
    );
};
