import { Offer, Vehicle, VehicleCategory } from '../../../domain/Offer';
import { wrapError, RVErrorType } from '../../../domain/Error';

import { LoggerService } from '../../../services/LoggerService';

import {
    OfferResponse,
    HCRatesApiConfigurationResponse,
    CarResponse,
    ExtraInformationResponse,
    EquipmentResponse,
    EquipmentTypeResponse,
    CarTypeResponse,
    ConditionalFeeTypeResponse,
} from '../../response/HCRatesApiResponse';

import { mapSupplier } from '../Supplier';
import { mapProvider } from '../Provider';
import { mapApiOfferPriceDetails } from './PriceDetails';
import { mapExtras } from './Extras';
import { mapInsurances } from './Insurances';
import { mapPickupDropOff } from './PickupDropoff';
import { mapApiMileage } from './Mileage';
import { mapFuelPolicy } from './FuelPolicy';
import { mapPackageType } from './Package';
import { mapRatingsReponse } from '../Ratings';

const vehicleTypeMap = new Map<CarTypeResponse, VehicleCategory>([
    [CarTypeResponse.MINI, VehicleCategory.MINI],
    [CarTypeResponse.ECONOMY, VehicleCategory.ECONOMY],
    [CarTypeResponse.COMPACT, VehicleCategory.COMPACT],
    [CarTypeResponse.MIDDLE_INTERMEDIATE, VehicleCategory.MIDDLE_INTERMEDIATE],
    [CarTypeResponse.FULLSIZED_CLASS, VehicleCategory.FULLSIZED_CLASS],
    [CarTypeResponse.PREMIUM_CLASS, VehicleCategory.PREMIUM_CLASS],
    [CarTypeResponse.CABRIO, VehicleCategory.CABRIO],
    [CarTypeResponse.STATION_WAGON, VehicleCategory.STATION_WAGON],
    [CarTypeResponse.VAN, VehicleCategory.VAN],
    [CarTypeResponse.SUV, VehicleCategory.SUV],
    [CarTypeResponse.TRANSPORTER, VehicleCategory.TRANSPORTER],
    [CarTypeResponse.PICKUP, VehicleCategory.PICKUP],
]);

const mapCarResponse = (
    carResponse: CarResponse,
    extraInformation: ExtraInformationResponse,
    equipments: EquipmentResponse[],
): Vehicle => ({
    category: vehicleTypeMap.get(extraInformation.happycarCarType) || null,
    name: carResponse.description,
    imageUrl: carResponse.image || null,
    acrissCode: carResponse.acriss,
    gearType: extraInformation.rateAdditionals.isAutomatic ? 'automatic' : 'manual',
    bags: {
        min: (carResponse.luggage && carResponse.luggage.small) || null,
        max: (carResponse.luggage && carResponse.luggage.large) || null,
    },
    seats: carResponse.passengers || null,
    doors: carResponse.mindoors || carResponse.maxdoors || null,
    hasAC: equipments.some(e => e.included && e.type === EquipmentTypeResponse.AIR_CONDITIONING),
});

export type MapperConfigArgs = HCRatesApiConfigurationResponse & {
    rateSearchKey: string;
    baseUrl: string;
};

const mapOffer = (
    {
        extraInformation,
        car,
        equipmentsList,
        uniqueidentifier: rateId,
        provider: providerResponse,
        paydesk,
        totalprice,
        pickupbranch,
        dropoffbranch,
        conditionalfeesList,
        includedinsurance,
        distance,
    }: OfferResponse,
    {
        currencyCode,
        providersConfiguration: { clickout, sanitizationGuarantee, logos },
        rateSearchKey,
        baseUrl,
    }: MapperConfigArgs,
    loggerService: LoggerService,
): Offer => {
    const supplierResponse = pickupbranch.supplier && pickupbranch.supplier;
    const ratings = mapRatingsReponse(pickupbranch.supplier && pickupbranch.supplier.customerratings);

    return {
        rateId,
        hcPackage: mapPackageType(extraInformation.happycarPackage),
        vehicle: mapCarResponse(car, extraInformation, equipmentsList),
        supplier: supplierResponse ? mapSupplier(supplierResponse, ratings.average) : null,
        provider: mapProvider(providerResponse, logos),
        ratings,
        priceDetails: mapApiOfferPriceDetails({
            atDeskPrice: paydesk,
            totalPrice: totalprice,
            providerResponse,
            fees: conditionalfeesList,
            currencyCode,
            loggerService,
            rateId,
        }),
        bookingUrl: `${baseUrl}/rates/${rateSearchKey}/${rateId}/verify`,
        partnerBookingUrl: clickout.includes(providerResponse.id)
            ? `${baseUrl}/rates/${rateSearchKey}/${rateId}/clickout`
            : null,
        extras: mapExtras(conditionalfeesList, equipmentsList),
        insurances: (includedinsurance && mapInsurances(includedinsurance, currencyCode)) || [],
        pickUpDropOff: mapPickupDropOff(pickupbranch, dropoffbranch),
        mileage: mapApiMileage(distance, conditionalfeesList, rateId),
        fuelPolicy: mapFuelPolicy(conditionalfeesList),
        hasSanitationGuarantee:
            sanitizationGuarantee.includes(providerResponse.id) ||
            conditionalfeesList.some(
                f => f.conditionalfeetype === ConditionalFeeTypeResponse.SANITISATION_FEE && f.included,
            ),
    };
};

export const mapOffers = (
    offers: OfferResponse[],
    configuration: MapperConfigArgs,
    loggerService: LoggerService,
): Offer[] =>
    offers.reduce<Offer[]>((offers, o) => {
        try {
            offers.push(mapOffer(o, configuration, loggerService));
        } catch (e) {
            loggerService.logOfferMappingError({
                error: wrapError(e, RVErrorType.UNEXPECTED_MAPPING_SCENARIO),
                rateId: o?.uniqueidentifier,
                providerId: o?.provider?.id,
            });
        }
        return offers;
    }, []);
