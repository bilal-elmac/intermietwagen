import React from 'react';
import { useIntl } from 'react-intl';

import { useReduxState } from '../reducers/Actions';

export const HomePageURL: React.FC<React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>> = props => {
    const homePageURL = useReduxState(state => state.dynamicConfiguration?.homePageURL);
    const intl = useIntl();

    return (
        <a
            href={homePageURL}
            title={homePageURL && intl.formatMessage({ id: 'LABEL_LOGO_TITLE' }, { homePageUrl: homePageURL })}
            {...props}
        />
    );
};
