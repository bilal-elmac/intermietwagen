import { HCRatesApiConfigurationResponse } from '../response/HCRatesApiResponse';
import { DynamicConfiguration, Age, CarTypesDetails } from '../../domain/Configuration';
import { RVError, RVErrorType } from '../../domain/Error';
import vehicleTypeMap from './VehicleTypesMap';

export const mapAge = (ageId: string, ageSpan: string): Age => {
    const [minAge, maxAge] = ageSpan.split('-').map(Number);

    if (!minAge) {
        throw new RVError(RVErrorType.UNEXPECTED_MAPPING_SCENARIO, 'Unexpected age configuration loaded');
    }

    return {
        id: ageId,
        ageRange: maxAge ? [minAge, maxAge] : [minAge],
    };
};

export const mapDynamicConfiguration = (configuration: HCRatesApiConfigurationResponse): DynamicConfiguration => {
    const ages: Age[] = [];
    let initialAge: Age | null = null;

    Object.entries(configuration.rentalAges).forEach(([ageKey, ageSpan]) => {
        ages.push(mapAge(ageKey, ageSpan));

        if (Number(ageKey) === configuration.initialRentalAge) {
            initialAge = ages[ages.length - 1];
        }
    });

    if (!initialAge || ages.length === 0) {
        throw new RVError(RVErrorType.UNEXPECTED_MAPPING_SCENARIO, 'Unexpected initial age configuration loaded');
    }

    const carTypesDetails: CarTypesDetails[] = [];
    if (configuration.carTypesDetails) {
        configuration.carTypesDetails.forEach(typeItem => {
            const carType = vehicleTypeMap.get(typeItem.carType) || null;
            if (carType) {
                carTypesDetails.push({ ...typeItem, carType });
            }
        });
    }

    return {
        initialRentalAge: initialAge,
        rentalAges: ages,
        homePageURL: configuration.endpoints.homePageUrl,
        fallBackCarImage: configuration.defaultImageUrl,
        loadingSuppliers: configuration.loadingSuppliers,
        carTypesDetails,
    };
};
