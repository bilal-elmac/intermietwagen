import { VehicleCategory } from '../../domain/Filter';

const ORDER: VehicleCategory[] = [
    'MINI',
    'ECONOMY',
    'COMPACT',
    'MIDDLE_INTERMEDIATE',
    'SUV',
    'CABRIO',
    'FULLSIZED_CLASS',
    'PREMIUM_CLASS',
    'STATION_WAGON',
    'VAN',
    'PICKUP',
    'TRANSPORTER',
];

export const sortVehicleCategories = (a: VehicleCategory, b: VehicleCategory): number =>
    ORDER.indexOf(a) - ORDER.indexOf(b);
