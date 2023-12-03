import React from 'react';
import { FormattedMessage } from 'react-intl';
import { SvgIcon, SvgIconProps } from '@material-ui/core';
import classNames from 'classnames';

import { boldFormatter } from '../../../utils/FormatterUtils';

interface Props {
    readonly offersAmount?: number;
    readonly onChange: () => void;
    readonly isShortForm?: boolean;
}

const FilterIcon = (props: SvgIconProps): JSX.Element => (
    <SvgIcon className="hc-results-view__responsive-filter-toggle__icon" {...props}>
        <g fill="#FFF" fillRule="evenodd">
            <path d="M7.188 7.017C5.509 7.017 4.144 5.663 4.144 4c0-1.663 1.365-3.016 3.044-3.016S10.232 2.337 10.232 4 8.867 7.017 7.188 7.017m16.819-4H11.086a4.027 4.027 0 00-7.797 0H.992A.987.987 0 000 4c0 .544.444.984.992.984h2.297a4.027 4.027 0 007.797 0h12.921c.548 0 .993-.44.993-.984a.988.988 0 00-.993-.983M17.812 15.017c1.679 0 3.044-1.354 3.044-3.017 0-1.663-1.365-3.016-3.044-3.016S14.768 10.337 14.768 12s1.365 3.017 3.044 3.017m-16.819-4h12.921a4.027 4.027 0 017.797 0h2.297c.548 0 .992.439.992.983a.988.988 0 01-.992.984h-2.297a4.027 4.027 0 01-7.797 0H.993A.988.988 0 010 12c0-.544.445-.983.993-.983M7.188 23.017c-1.679 0-3.044-1.354-3.044-3.017 0-1.663 1.365-3.016 3.044-3.016s3.044 1.353 3.044 3.016-1.365 3.017-3.044 3.017m16.819-4H11.086a4.027 4.027 0 00-7.797 0H.992A.987.987 0 000 20c0 .544.444.984.992.984h2.297a4.027 4.027 0 007.797 0h12.921c.548 0 .993-.44.993-.984a.988.988 0 00-.993-.983" />
        </g>
    </SvgIcon>
);

export const MobileButton: React.FC<Props> = ({ offersAmount, onChange, isShortForm }): JSX.Element => (
    <div
        className={classNames(
            isShortForm && 'hc-results-view__mobile-filter-toggle--short',
            'hc-results-view__mobile-filter-toggle',
        )}
    >
        <button className="hc-results-view__mobile-filter-toggle__container" onClick={onChange}>
            {!isShortForm && offersAmount && (
                <p className="hc-results-view__mobile-filter-toggle__label md:pl-8">
                    <span className="hc-results-view__mobile-filter-toggle__label--title">
                        <FormattedMessage id="LABEL_OPEN_FILTERS" />
                    </span>
                    <span className="hc-results-view__mobile-filter-toggle__label--info md:text-xs">
                        <FormattedMessage
                            id="LABEL_NUMBER_OF_OFFERS_AVAILABLE"
                            values={{ num: offersAmount, strong: boldFormatter }}
                        />
                    </span>
                </p>
            )}
            <div className="hc-results-view__mobile-filter-toggle__button md:p-6">
                <FilterIcon />
            </div>
        </button>
    </div>
);
