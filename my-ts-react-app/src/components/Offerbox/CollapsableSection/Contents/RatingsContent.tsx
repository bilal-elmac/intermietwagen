import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@material-ui/core';

import { Supplier } from '../../../../domain/Supplier';
import { Ratings } from '../../../../domain/Offer';
import { DetailedCountedRating, CountedRating, AverageRating } from '../../../../domain/Rating';

import Rating, { FormattedRating, DEFAULT_STAR_COUNT } from '../../../../ui/Rating';
import RatingBarChart from '../../../../ui/RatingBarChart';
import { TabProps } from '../Panel';

interface CustomClassesProps {
    readonly customClassNames?: string;
}

interface SupplierDetailsProps extends CustomClassesProps {
    readonly supplier: Supplier | null;
}

interface RatingsSummaryProps extends CustomClassesProps {
    readonly ratings: Ratings;
}

interface AverageRatingDetailProps extends CustomClassesProps {
    readonly rating: DetailedCountedRating & CountedRating & AverageRating;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ customClassNames, supplier }) => (
    <div className={`${customClassNames}__supplier-details`}>
        {supplier && supplier.logoUrl && (
            <img src={supplier.logoUrl} alt={supplier.name} className="h-6 max-w-none w-auto" />
        )}
        <h2 className={classNames('font-bold leading-none text-xl', supplier && supplier.logoUrl && 'ml-5')}>
            <FormattedMessage id="LABEL_LOCAL_SUPPLIER_RATINGS" />
        </h2>
    </div>
);

const RatingLine = ({
    label,
    rating,
}: {
    label: string;
    rating: AverageRating | null;
    showTotal?: boolean;
}): JSX.Element | null => {
    if (!rating) {
        return null;
    }

    return (
        <TableRow>
            <TableCell className="rating-title" scope="row">
                <FormattedMessage id={label} />
            </TableCell>
            <TableCell className="rating-stats" align="left">
                <Rating suffixClassName="font-semibold" rating={rating.average} />
            </TableCell>
        </TableRow>
    );
};

const RatingsSummary: React.FC<RatingsSummaryProps> = ({ customClassNames, ratings }) => (
    <div className={`${customClassNames}__ratings-details__all-ratings`}>
        <TableContainer>
            <Table size="small">
                <TableBody>
                    <RatingLine label="LABEL_OVERALL_VALUE_RATING" rating={ratings.overallValue} />
                    <RatingLine label="LABEL_HELPFULNESS_AT_COUNTER_RATING" rating={ratings.staff} />
                    <RatingLine label="LABEL_COLLECT_TIME_RATING" rating={ratings.pickUpTime} />
                    <RatingLine label="LABEL_RETURN_TIME_RATING" rating={ratings.dropOffTime} />
                    <RatingLine label="LABEL_CLEANLINESS_RATING" rating={ratings.vehicleCleanliness} />
                    <RatingLine label="LABEL_CAR_CONDITION_RATING" rating={ratings.vehicleOverallCondition} />
                    <RatingLine label="LABEL_RENTAL_LOCATION_RATING" rating={ratings.location} />
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);

const AverageRatingDetails: React.FC<AverageRatingDetailProps> = ({ customClassNames, rating }) => {
    const max = rating.detailedCount && Math.max(...rating.detailedCount);

    return (
        <div className={`${customClassNames}__ratings-details__summary-ratings`}>
            <h3 className="font-bold leading-none tracking-normal">
                <FormattedRating rating={rating.average * DEFAULT_STAR_COUNT} /> / {DEFAULT_STAR_COUNT}
            </h3>
            <div className={`${customClassNames}__ratings-details__summary-ratings__rating-stars-summary`}>
                <Rating suffixClassName="font-semibold" rating={rating.average} hideNumber />
                <p>
                    {rating.count} <FormattedMessage id="LABEL_CUSTOMER_RATINGS" />
                </p>
            </div>
            {rating.detailedCount && max && (
                <div className={`${customClassNames}__ratings-details__summary-ratings__rating-stars-explained`}>
                    {rating.detailedCount
                        .map((count, k) => <RatingBarChart key={k} category={k + 1} count={count} max={max} />)
                        .reverse()}
                </div>
            )}
        </div>
    );
};

const RatingsContent: React.FC<RatingsSummaryProps & SupplierDetailsProps & TabProps> = ({
    customClassNames,
    supplier,
    ratings,
}) => (
    <div className={customClassNames}>
        <SupplierDetails customClassNames={customClassNames} supplier={supplier} />
        <div className={`${customClassNames}__ratings-details`}>
            <RatingsSummary customClassNames={customClassNames} ratings={ratings} />
            {ratings.average && <AverageRatingDetails customClassNames={customClassNames} rating={ratings.average} />}
        </div>
    </div>
);

export default RatingsContent;
