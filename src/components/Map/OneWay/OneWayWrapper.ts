import React, { ReactNode } from 'react';

import { hasOffers as selectHasOffers } from '../../../domain/AppState';

import { useReduxState } from '../../../reducers/Actions';

import { isTabletOrSmaller } from '../../../utils/MediaQueryUtils';

import { Map } from '..';

export const OneWayWrapper: React.FC<{ readonly children?: ReactNode }> = ({ children }): JSX.Element | null => {
    const hasOffers = useReduxState(selectHasOffers);
    const isOneWay = useReduxState(s => Boolean(s.search?.isOneWay));
    const isMobile = isTabletOrSmaller();

    return isOneWay && hasOffers && !isMobile ? <Map closeable>{children}</Map> : null;
};
