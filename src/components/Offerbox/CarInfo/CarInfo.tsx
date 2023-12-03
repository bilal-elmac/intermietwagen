import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Vehicle } from '../../../domain/Offer';

import { useReduxState } from '../../../reducers/Actions';

import { OneSizedArray } from '../../../utils/TypeUtils';

import MultiSourcedImage from '../../../ui/MultiSourcedImage';

interface Props {
    readonly offerBoxClass: string;
    readonly children: React.ReactNode;
}

export const CarInfo: React.FC<Props & Vehicle> = ({
    imageUrl,
    category,
    name,
    offerBoxClass,
    children: appendixes,
}): JSX.Element => {
    const fallBackCarImage = useReduxState(s => s.dynamicConfiguration?.fallBackCarImage);

    const carImages: string[] = [];
    let alt = undefined;
    if (imageUrl) {
        carImages.push(imageUrl);
        alt = [name];

        if (fallBackCarImage) {
            carImages.push(fallBackCarImage);
        }
    }

    return (
        <div className={`${offerBoxClass}__car-info`}>
            {carImages.length > 0 && <MultiSourcedImage src={carImages as OneSizedArray<string>} alt={alt} />}
            <p>
                <span className="font-bold">
                    <FormattedMessage id={`LABEL_CAR_CATEGORY_${category}`} />
                </span>
            </p>
            {appendixes}
        </div>
    );
};
