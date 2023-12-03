import { PackageType } from './OfferPackage';
import { Provider } from './Provider';
import { Supplier } from './Supplier';
import { Price } from './Price';
import { DetailedCountedRating, AverageRating, CountedRating } from './Rating';
import { Place, PickupDropoff } from './Location';
import { StationType, Station } from './Station';
import { Insurance } from './Insurance';

export interface Ratings {
    readonly average: (DetailedCountedRating & CountedRating & AverageRating) | null;

    readonly overallValue: AverageRating | null;
    readonly staff: AverageRating | null;
    readonly pickUpTime: AverageRating | null;
    readonly dropOffTime: AverageRating | null;
    readonly vehicleCleanliness: AverageRating | null;
    readonly vehicleOverallCondition: AverageRating | null;
    readonly location: AverageRating | null;
}

export type FeeType =
    | 'AFTER_HOURS'
    | 'AIRPORT'
    | 'CROSS_BORDER'
    | 'DROP_OFF'
    | 'OLD_DRIVER'
    | 'ONE_WAY'
    | 'PARKING'
    | 'ROAD_TAXES'
    | 'ADDITIONAL_TAXES'
    | 'TOLLS'
    | 'VEHICLE_DELIVERY'
    | 'WINTER_SERVICE'
    | 'YOUNG_DRIVER'
    | 'ENVIRONMENTAL_TAX'
    | 'UNKNOWN';

export interface Fee extends Price {
    readonly feeType: FeeType;
    readonly alreadyIncluded: boolean;
}

// To be loaded in offers
export type PaymentMethod = 'AMEX' | 'VISA' | 'MASTERCARD' | 'PAY_PAL';

export interface PriceDetails {
    readonly carRentalPrice: Price;
    readonly fees: Fee[];
    readonly dueAtDeskPrice: Price;
    readonly totalPrice: Price;
    readonly paymentMethods: PaymentMethod[];
}

export type GearType = 'manual' | 'automatic';

export enum VehicleCategory {
    MINI = 'MINI',
    ECONOMY = 'ECONOMY',
    COMPACT = 'COMPACT',
    MIDDLE_INTERMEDIATE = 'MIDDLE_INTERMEDIATE',
    FULLSIZED_CLASS = 'FULLSIZED_CLASS',
    PREMIUM_CLASS = 'PREMIUM_CLASS',
    CABRIO = 'CABRIO',
    STATION_WAGON = 'STATION_WAGON',
    VAN = 'VAN',
    SUV = 'SUV',
    TRANSPORTER = 'TRANSPORTER',
    PICKUP = 'PICKUP',
}

export interface Vehicle {
    readonly category: VehicleCategory | null;
    readonly name: string;
    readonly imageUrl: string | null;
    readonly acrissCode: string;
    readonly gearType: GearType;
    readonly seats: number | null;
    readonly bags: { readonly min: number | null; readonly max: number | null };
    readonly doors: number | null;
    readonly hasAC: boolean;
}

export type DistanceUnit = 'km' | 'miles';

interface LimitedMileage {
    readonly included: number;
    readonly pricePerAdditional: Price;
}

interface UnlimitedMileage {
    readonly included: null;
    readonly pricePerAdditional: null;
}

export type Mileage = (LimitedMileage | UnlimitedMileage) & { readonly distanceUnit: DistanceUnit };

export type PickupType = 'shuttle' | 'meet_and_greet' | 'desk_at_place' | 'unknown';

export interface PickupInfo {
    readonly iata: string | null;
    readonly pickupType: PickupType;
    readonly stationType: StationType;
}

export type Extra =
    | 'cross_border'
    | 'vehicle_delivery'
    | 'baby_seat'
    | 'booster_seat'
    | 'child_seat'
    | 'gps'
    | 'additional_driver'
    | 'ski_racks'
    | 'winter_tires'
    | 'snow_chains';

export type FuelPolicy = 'UNKNOWN' | 'e2e' | 'h2h' | 'f2f' | 'f2e' | 'q2e' | 's2s';

export type OfferPickUpDropOff = PickupDropoff<Place & PickupInfo & Pick<Station, 'id'>, Place & Pick<Station, 'id'>>;

export interface Offer {
    readonly rateId: string;

    readonly hcPackage: PackageType | null;

    readonly vehicle: Vehicle;

    readonly supplier: Supplier | null;
    readonly provider: Provider;

    readonly ratings: Ratings;
    readonly priceDetails: PriceDetails;

    readonly bookingUrl: string;
    readonly partnerBookingUrl: string | null;

    readonly extras: Extra[];

    readonly insurances: Insurance[];

    readonly pickUpDropOff: OfferPickUpDropOff;
    readonly mileage: Mileage;
    readonly fuelPolicy: FuelPolicy;

    readonly hasSanitationGuarantee: boolean;
}
