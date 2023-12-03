import { CarTypeResponse } from '../response/HCRatesApiResponse';
import { VehicleCategory } from '../../domain/Filter';

const vehicleTypeMap = new Map<CarTypeResponse, VehicleCategory>([
    [CarTypeResponse.MINI, 'MINI'],
    [CarTypeResponse.ECONOMY, 'ECONOMY'],
    [CarTypeResponse.COMPACT, 'COMPACT'],
    [CarTypeResponse.MIDDLE_INTERMEDIATE, 'MIDDLE_INTERMEDIATE'],
    [CarTypeResponse.FULLSIZED_CLASS, 'FULLSIZED_CLASS'],
    [CarTypeResponse.PREMIUM_CLASS, 'PREMIUM_CLASS'],
    [CarTypeResponse.CABRIO, 'CABRIO'],
    [CarTypeResponse.STATION_WAGON, 'STATION_WAGON'],
    [CarTypeResponse.VAN, 'VAN'],
    [CarTypeResponse.SUV, 'SUV'],
    [CarTypeResponse.TRANSPORTER, 'TRANSPORTER'],
    [CarTypeResponse.PICKUP, 'PICKUP'],
]);

export default vehicleTypeMap;
