import React from 'react';

import { VehicleCategory } from '../../../domain/Filter';
import { useReduxState } from '../../../reducers/Actions';

export const CarCategoryIcon: React.FC<{ type: VehicleCategory }> = ({ type }): JSX.Element | null => {
    const carTypesDetails = useReduxState(s => s.dynamicConfiguration?.carTypesDetails);
    const noImagePath = useReduxState(s => s.dynamicConfiguration?.fallBackCarImage);

    const iconPath = carTypesDetails?.find(carTypesInfo => carTypesInfo.carType === type)?.imageUrl || noImagePath;
    return iconPath ? (
        <div className="flex-grow flex items-center">
            <img src={iconPath} alt={type} />
        </div>
    ) : null;
};
