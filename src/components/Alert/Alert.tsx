import React, { useState, createRef } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Error, Replay } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Snackbar, useScrollTrigger } from '@material-ui/core';

import { LoadingStatus } from '../../domain/LoadingStatus';
import { willNeverHaveResults as selectWillNeverHaveResults } from '../../domain/AppState';

import { useReduxDispatch, useReduxState } from '../../reducers/Actions';
import { loadDataAction, loadBufferedData } from '../../reducers/DataActions';
import { clearFilters } from '../../reducers/FilterActions';
import { useServices } from '../../state/Services.context';

import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import TooltipIcon from '../../ui/IconTooltip';

import { isMobile, isTablet, isPortrait } from '../../utils/MediaQueryUtils';
import { scrollTo } from '../../utils/ScrollUtils';
import { customAnchorFormatter } from '../../utils/FormatterUtils';

const useFirstLoadDispatch = (onLoaded?: () => void): (() => void) => {
    const dispatch = useReduxDispatch();

    const sort = useReduxState(app => app.sort);
    const currentPage = useReduxState(app => app.currentPage);
    const rateSearchKey = useReduxState(app => app.rateSearchKey);

    return (): void => {
        if (!rateSearchKey) {
            return;
        }

        dispatch(loadDataAction({ rateSearchKey, sort, currentPage, loadingSource: LoadingStatus.LOADING_BY_USER }));
        onLoaded && onLoaded();
    };
};

export const SearchErrorModal = ({ onSearched }: { onSearched?: () => void }): JSX.Element | null => {
    const rateSearchKey = useReduxState(app => app.rateSearchKey);
    const load = useFirstLoadDispatch(onSearched);

    return (
        <Modal
            style={isMobile() ? { height: '370px', width: '350px' } : { height: '340px', width: '500px' }}
            headline={<FormattedMessage id="LABEL_UNEXPECTED_ERROR" />}
            noContentMargin
        >
            <div className="hc-results-view__error-panel text-center w-full">
                <div className="leading-none hc-results-view__error-panel__icon">
                    <Error fontSize="inherit" className="text-error" />
                </div>
                <p className="mb-4 whitespace-pre-line">
                    <FormattedMessage id="LABEL_ERROR_MODAL_BODY" />
                </p>
                {rateSearchKey && (
                    <Button id="hc-error-modal" name="hc-error-modal" iconLeft={<Replay />} onClick={load}>
                        <span className="ml-3">
                            <FormattedMessage id="LABEL_TRIGGER_SEARCH" />
                        </span>
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export const SearchErrorAlert = (): JSX.Element | null => {
    const load = useFirstLoadDispatch();

    const [open, setOpen] = useState(true);
    const rateSearchKey = useReduxState(app => app.rateSearchKey);

    if (!rateSearchKey || !open) {
        return null;
    }

    return (
        <Alert className="w-full mb-4" variant="filled" onClose={(): void => setOpen(false)} severity="error">
            <div className="block">
                <FormattedMessage id="LABEL_UNEXPECTED_ERROR" />.
                <span className="ml-1 underline cursor-pointer" onClick={load}>
                    <FormattedMessage id="LABEL_SEARCH_AGAIN" />.
                </span>
            </div>
        </Alert>
    );
};

export const NoResultsAlert = (): JSX.Element | null => {
    const dispatch = useReduxDispatch();

    const cantHaveResults = useReduxState(selectWillNeverHaveResults);
    const homePageURL = useReduxState(s => s.dynamicConfiguration && s.dynamicConfiguration.homePageURL);

    if (!homePageURL) {
        return null;
    }

    return (
        <>
            <div className="text-center w-full whitespace-pre-wrap">
                <TooltipIcon className="h-20 my-4" width="100%" viewBox="0 0 37 40" />
                <FormattedMessage id="LABEL_NO_RESULTS_TIPS" values={{ canClearFilters: !cantHaveResults }} />
            </div>
            <div className="m-auto mt-4">
                <Button
                    id={cantHaveResults ? 'hc-results-view__new-search-button' : 'hc-results-view__no-filters-button'}
                    onClick={(): void => {
                        if (cantHaveResults) {
                            location.assign(homePageURL);
                        } else {
                            dispatch(clearFilters());
                        }
                    }}
                >
                    <FormattedMessage id={cantHaveResults ? 'LABEL_SEARCH_AGAIN' : 'LABEL_FILTER_RESET'} />
                </Button>
            </div>
        </>
    );
};

export const NewResultsAlert = (): JSX.Element => {
    const baseClass = 'hc-results-view__buffer-alert';
    const { analyticsService } = useServices();

    const dispatch = useReduxDispatch();
    const trigger = useScrollTrigger({ disableHysteresis: true });
    const mobile = isMobile();
    const tablet = isTablet();
    const portrait = isPortrait();

    const ref = createRef<HTMLDivElement>();

    // On mobile we add a margin to not eclipse the filter button
    const alert = (
        <Alert
            className={classNames(
                baseClass,
                trigger && `${baseClass}--bottom`,
                mobile && `${baseClass}--mobile`,
                tablet && `${baseClass}--tablet`,
                portrait && `${baseClass}--portrait`,
            )}
            variant="filled"
            severity="success"
        >
            <div className="block">
                <FormattedMessage
                    id="LABEL_NEW_RESULTS_WARNING"
                    values={{
                        a: customAnchorFormatter({
                            className: 'underline cursor-pointer',
                            onClick: () => {
                                dispatch(loadBufferedData());
                                if (trigger) {
                                    scrollTo('vertical', ref.current, { inline: 'center' });
                                    analyticsService.onLoadBufferedOffers('bottom');
                                } else {
                                    analyticsService.onLoadBufferedOffers('top');
                                }
                            },
                        }),
                    }}
                />
            </div>
        </Alert>
    );

    return (
        <>
            <div ref={ref} />
            {trigger ? (
                <Snackbar
                    open
                    anchorOrigin={
                        tablet || mobile
                            ? { vertical: 'bottom', horizontal: 'left' }
                            : { vertical: 'bottom', horizontal: 'center' }
                    }
                >
                    {alert}
                </Snackbar>
            ) : (
                alert
            )}
        </>
    );
};
