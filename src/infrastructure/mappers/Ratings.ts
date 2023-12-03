import { Ratings } from '../../domain/Offer';
import { AverageRating } from '../../domain/Rating';

import { SupplierRatingsResponse } from '../response/HCRatesApiResponse';

type Fields = Extract<
    keyof SupplierRatingsResponse,
    'valformoney' | 'efficiency' | 'pickuptime' | 'dropofftime' | 'cleanliness' | 'condition' | 'locating'
>;

const mapRatingReponse = (ratings: SupplierRatingsResponse | null, ...fields: Fields[]): AverageRating | null => {
    if (!ratings) {
        return null;
    }

    let average = 0;
    let count = 0;
    for (const field of fields) {
        const rating = ratings[field];
        if (rating) {
            count++;
            average += rating / 5;
        }
    }

    if (count === 0) {
        return null;
    }

    return { average: average / count };
};

export const mapRatingsReponse = (ratings: SupplierRatingsResponse | null): Ratings => {
    const average = mapRatingReponse(
        ratings,
        'efficiency',
        'valformoney',
        'pickuptime',
        'dropofftime',
        'cleanliness',
        'condition',
        'locating',
    );

    const count = ratings && ratings.count;

    return {
        average: average && count ? { ...average, count, detailedCount: null } : null,
        staff: count ? mapRatingReponse(ratings, 'efficiency') : null,
        overallValue: count ? mapRatingReponse(ratings, 'valformoney') : null,
        pickUpTime: count ? mapRatingReponse(ratings, 'pickuptime') : null,
        dropOffTime: count ? mapRatingReponse(ratings, 'dropofftime') : null,
        vehicleCleanliness: count ? mapRatingReponse(ratings, 'cleanliness') : null,
        vehicleOverallCondition: count ? mapRatingReponse(ratings, 'condition') : null,
        location: count ? mapRatingReponse(ratings, 'locating') : null,
    };
};
