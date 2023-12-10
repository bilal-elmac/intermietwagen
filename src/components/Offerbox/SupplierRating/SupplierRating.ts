import React from 'react';
import { AverageRating, CountedRating } from '../../../domain/Rating';
import Rating from '../../../ui/Rating';

interface Props {
    readonly rating: (AverageRating & CountedRating) | null;
    readonly offerBoxClass: string;
    readonly onClick?: () => void;
}

export const SupplierRating: React.FC<Props> = ({ rating, offerBoxClass, onClick }): JSX.Element | null => {
    const average = (rating && rating.average) || 0;
    const count = (rating && rating.count) || 0;

    return average > 0 && count > 0 ? (
        <div className={`${offerBoxClass}__supplier-container`} onClick={onClick}>
            <span className={`${offerBoxClass}__supplier-container__ratings`}>
                <Rating
                    className="mb-1"
                    suffixClassName="font-semibold mb-auto mt-auto text-sm"
                    rating={average}
                    count={count}
                />
            </span>
        </div>
    ) : null;
};
