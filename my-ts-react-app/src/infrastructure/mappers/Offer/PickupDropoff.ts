import { PickupType, OfferPickUpDropOff } from '../../../domain/Offer';

import { PickUpTypeResponse, BranchResponse } from '../../response/HCRatesApiResponse';

import { mapBranchType } from '../Branch';

const branchPickupTypeMap = new Map<PickUpTypeResponse, PickupType>([
    [PickUpTypeResponse.SHUTTLE, 'shuttle'],
    [PickUpTypeResponse.MEET_AND_GREET, 'meet_and_greet'],
    [PickUpTypeResponse.DESK_AT_PLACE, 'desk_at_place'],
]);

export const mapPickupDropOff = (
    { location, pickuptype, typeofbranch, ...pickupBranch }: BranchResponse,
    dropOffBranch: BranchResponse,
): OfferPickUpDropOff => ({
    pickUp: {
        iata: location.iata || null,
        pickupType: branchPickupTypeMap.get(pickuptype) || 'unknown',
        stationType: mapBranchType(typeofbranch),
        locationName: pickupBranch.name || null,
        id: pickupBranch.id,
    },
    dropOff: {
        locationName: dropOffBranch.name || null,
        id: dropOffBranch.id,
    },
    isOneWay: pickupBranch.id !== dropOffBranch.id,
});
