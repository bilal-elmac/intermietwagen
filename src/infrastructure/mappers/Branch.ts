import { BranchTypeResponse } from '../response/HCRatesApiResponse';
import { StationType } from '../../domain/Station';

const branchTypeMap = new Map<BranchTypeResponse, StationType>([
    [BranchTypeResponse.AIRPORT, 'airport'],
    [BranchTypeResponse.RAILWAY, 'railway'],
    [BranchTypeResponse.CITY, 'city'],
    [BranchTypeResponse.FERRY, 'ferry'],
    [BranchTypeResponse.HOTEL, 'hotel'],
]);

export const mapBranchType = (typeofbranch: BranchTypeResponse): StationType =>
    branchTypeMap.get(typeofbranch) || 'unknown';
