import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

interface RatingBarChartProps {
    readonly category: number;
    readonly count: number;
    readonly max: number;
}

export const RatingBarChart: React.FC<RatingBarChartProps> = ({ category, count, max }) => {
    const baseClassBarChart = 'hc-results-view__rating-bar-chart__bar-chart-container__bar-chart';
    const barChartColor = `${baseClassBarChart}__stars-${category}`;

    // Min 10 Max 100
    const width = 10 + 90 * (count / max);

    return (
        <div className="hc-results-view__rating-bar-chart">
            <p className="underline w-20">
                <FormattedMessage id="LABEL_RATING_STAR_CATEGORY" values={{ category }} />
            </p>
            <div className="hc-results-view__rating-bar-chart__bar-chart-container">
                <div style={{ width: `${width}%` }} className={classNames(baseClassBarChart, barChartColor)}></div>
                <span>{count}</span>
            </div>
        </div>
    );
};
