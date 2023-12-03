import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Pagination } from '@material-ui/lab';

import { offersAmount as selectOffersAmount } from '../../domain/AppState';

import { updateCurrentPage } from '../../reducers/FilterActions';
import { useReduxDispatch, useReduxState } from '../../reducers/Actions';
import { useServices } from '../../state/Services.context';

import { scrollToTop } from '../../utils/ScrollUtils';

const BASE_CLASS = 'hc-results-view__pagination';

export const PaginationComponent = (): JSX.Element | null => {
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();

    // UI controls
    const loadedOnce = useReduxState(state => state.loadedTimes > 0);
    const order = useReduxState(s => s.offers.standard.length + 1);

    // Controls
    const currentPage = useReduxState(s => s.currentPage);
    const totalPages = useReduxState(s => s.totalPages);
    const totalOffersCount = useReduxState(selectOffersAmount);
    const offersPerPage = useReduxState(s => s.offers.offersPerPage);

    if (!loadedOnce || !totalPages || (totalPages || 0) <= 1) {
        return null;
    }

    // Derived props
    const start = (currentPage - 1) * offersPerPage + 1;
    const end = Math.min(currentPage * offersPerPage, totalOffersCount);

    return (
        <div className={BASE_CLASS} style={{ order }}>
            <Pagination
                classes={{ root: `${BASE_CLASS}-wrapper`, ul: `${BASE_CLASS}-list` }}
                count={totalPages}
                page={currentPage}
                onChange={(_event: React.ChangeEvent<unknown>, value: React.SetStateAction<number>): void => {
                    scrollToTop(() => dispatch(updateCurrentPage(value as number)));
                    analyticsService.onPaginationClick(currentPage, value as number);
                }}
            />
            <div className={`${BASE_CLASS}-overview hidden md:block`}>
                <p>
                    <FormattedMessage
                        id="CONTENT_PAGINATION_OVERVIEW"
                        values={{
                            currentCount: (
                                <b>
                                    {start} - {end}
                                </b>
                            ),
                            totalCount: <b>{totalOffersCount}</b>,
                        }}
                    />
                </p>
            </div>
        </div>
    );
};
