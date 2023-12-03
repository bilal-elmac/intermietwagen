import React from 'react';
import { SvgIcon } from '@material-ui/core';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

import './Rating.css';

export const DEFAULT_STAR_COUNT = 5;

const FullStar = (): JSX.Element => (
    <SvgIcon fontSize="small" viewBox="0 0 15 13">
        <path
            fill="#FFD14D"
            fillRule="evenodd"
            d="M8.375.622l.979 3.167c.117.377.47.63.863.62l3.346-.077c.883-.02 1.244 1.13.508 1.62l-2.694 1.795a.885.885 0 0 0-.34 1.039l1.102 3.023c.299.823-.648 1.533-1.352 1.015L8.056 10.81a.882.882 0 0 0-1.046 0l-2.732 2.015c-.702.518-1.65-.192-1.35-1.015l1.1-3.023a.886.886 0 0 0-.339-1.04L.996 5.952c-.737-.49-.375-1.638.508-1.619l3.345.078a.88.88 0 0 0 .862-.621l.98-3.167c.257-.83 1.428-.83 1.684 0"
        />
    </SvgIcon>
);

const HalfStar = (): JSX.Element => (
    <SvgIcon fontSize="small" viewBox="0 0 14 13">
        <g fill="none" fillRule="evenodd">
            <path
                stroke="#FCD264"
                strokeWidth="1.5"
                d="M6.974.844a.133.133 0 0 0-.254 0l-.982 3.167a1.633 1.633 0 0 1-1.599 1.15L.79 5.081c-.134-.003-.189.17-.077.245L3.41 7.123c.629.418.89 1.212.63 1.921l-1.103 3.022c-.046.125.098.232.205.154l2.736-2.014a1.633 1.633 0 0 1 1.937 0l2.737 2.014c.106.078.25-.03.205-.153L9.654 9.044c-.26-.709 0-1.502.628-1.92l2.7-1.797c.111-.074.056-.248-.077-.245l-3.352.078a1.633 1.633 0 0 1-1.598-1.15L6.975.845zm0 0z"
            />
            <path
                fill="#FFD14D"
                d="M6.847.814v9.034L3.77 12.223l-1.092-.448L3.771 8.13C1.768 7.01.767 6.281.767 5.947V4.573h4.078l.914-3.19 1.088-.57z"
            />
        </g>
    </SvgIcon>
);

const EmptyStar = (): JSX.Element => (
    <SvgIcon fontSize="small" viewBox="0 0 14 13">
        <path
            fill="none"
            fillRule="evenodd"
            stroke="#FFD14D"
            strokeWidth="1.5"
            d="M7.26.844a.131.131 0 0 0-.252 0l-.98 3.166A1.632 1.632 0 0 1 4.43 5.16l-3.344-.078c-.132-.003-.187.171-.075.245l2.693 1.797c.627.418.887 1.21.629 1.92l-1.102 3.022c-.045.125.097.231.202.154l2.731-2.014a1.63 1.63 0 0 1 1.937 0l2.731 2.014c.105.077.247-.03.202-.154L9.934 9.044c-.259-.709 0-1.502.627-1.92l2.695-1.797c.11-.073.056-.248-.075-.245l-3.346.078a1.631 1.631 0 0 1-1.596-1.15L7.259.844zm0 0z"
        />
    </SvgIcon>
);

const RatingStar: React.FC<{
    readonly stars: number;
    readonly totalStars: number;
}> = ({ stars, totalStars }): JSX.Element => {
    const renderedStars = [];

    for (let i = 1; i <= totalStars; i++) {
        renderedStars.push(i <= stars ? <FullStar /> : Math.ceil(stars) === i ? <HalfStar /> : <EmptyStar />);
    }

    return (
        <ul className="hc-results-view__rating-stars">
            {renderedStars.map((star, k) => (
                <li key={k}>{star}</li>
            ))}
        </ul>
    );
};

export const FormattedRating: React.FC<{
    readonly rating: number;
}> = ({ rating }) => <FormattedNumber minimumFractionDigits={1} maximumFractionDigits={1} value={rating} />;

export const Rating: React.FC<{
    readonly className?: string;
    readonly suffixClassName?: string;

    readonly rating: number;
    readonly totalStars?: number;

    readonly count?: number;
    readonly showTotalStars?: boolean;
    readonly hideNumber?: boolean;
}> = ({ className, suffixClassName, rating, count, showTotalStars, hideNumber, totalStars = DEFAULT_STAR_COUNT }) => {
    const stars = rating * totalStars;
    const suffix = [showTotalStars ? ` / ${totalStars}` : '', count ? ` (${count})` : ''];

    return (
        <div className={classNames('hc-results-view__rating flex whitespace-no-wrap', className)}>
            <RatingStar stars={stars} totalStars={totalStars} />
            <span className={suffixClassName}>
                {!hideNumber && <FormattedRating rating={stars} />}
                {suffix.join('')}
            </span>
        </div>
    );
};
