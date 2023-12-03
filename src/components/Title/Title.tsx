import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

import { useReduxState } from '../../reducers/Actions';

export const useTitle = (): string => {
    const intl = useIntl();

    return useReduxState(({ staticConfiguration: { title }, search }) => {
        if (!search) {
            return title;
        }

        return intl.formatMessage(
            { id: 'APPLICATION_TITLE', defaultMessage: title },
            {
                locationName: search.pickUp.locationName || search.pickUp.suggestion.summary,
                from: intl.formatDate(search.pickUp.time),
                to: intl.formatDate(search.dropOff.time),
                title,
            },
        );
    });
};

export const Title: React.FC<{}> = () => (
    <Helmet>
        <title>{useTitle()}</title>
    </Helmet>
);
