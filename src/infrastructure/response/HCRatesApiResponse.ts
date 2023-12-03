import { AutocompleteSuggestionResponse as HCAutocompleteSuggestionResponse } from '@happycargmbh/hc-autocomplete-package';

/**
 * This list of responses is based on:
 *      - https://github.com/happycarteam/model-definition-protobuff
 *      - https://github.com/happycarteam/
 */
export enum TimeOfPaymentResponse {
    UNKNOWN_TIME_OF_PAYMENT = 0,
    PREPAID = 1,
    AT_DESK = 2,
    MULTIPLE = 3,
}

export enum ConditionalFeeTypeResponse {
    UNKNOWN_CONDITIONAL_FEE_TYPE = 0,
    DISCOUNT = 1,
    COVERAGE = 2,
    SURCHARGE = 3,
    FEE = 4,
    TAX = 5,
    ADDITIONAL_DISTANCE = 6,
    ADDITIONAL_WEEK = 7,
    ADDITIONAL_DAY = 8,
    ADDITIONAL_HOUR = 9,
    ADDITIONAL_DRIVER = 10,
    YOUNG_DRIVER = 11,
    YOUNGER_DRIVER = 12,
    SENIOR = 13,
    CUSTOMER_PICKUP = 14,
    CUSTOMER_DROP_OFF = 15,
    VEHICLE_DELIVERY = 16,
    VEHICLE_COLLECTION = 17,
    FUEL = 18,
    EQUIPMENT = 19,
    PREPAY_AMOUNT = 20,
    PAY_ON_ARRIVAL_AMOUNT = 21,
    PREPAID_FUEL = 22,
    ADJUSTMENT = 23,
    MANDATORY_CHARGES_TOTAL = 24,
    SUBTOTAL = 25,
    OPTIONAL = 26,
    CONTRACT_FEE = 27,
    AIRPORT_SURCHARGE = 28,
    AIR_CONDITIONING_SURCHARGE = 29,
    REGISTRATION_FEE = 30,
    VEHICLE_LICENSE_FEE = 31,
    WINTER_SERVICE_CHARGE = 32,
    BASE_RATE = 33,
    MANDATORY = 34,
    TOLLS = 35,
    EXTRA_PASSENGER_S = 36,
    STOP = 37,
    EXTRA_STOP = 38,
    WAIT_TIME = 39,
    SURFACE_TRANSPORTATION_CHARGE_STC = 40,
    TIP = 41,
    GRATUITY = 42,
    STANDARD_GRATUITY = 43,
    EXTRA_GRATUITY = 44,
    PARKING = 45,
    AIRPORT_FEE = 46,
    FUEL_SURCHARGE = 47,
    MEET_AND_GREET_SURCHARGE = 48,
    GREETER = 49,
    REPRESENTATIVE = 50,
    PHONE = 51,
    CLEANING_FEE = 52,
    TRAVEL_TIME_FEE = 53,
    EARLY_AM_FEE = 54,
    CAR_SEAT_FEE = 55,
    LATE_PM_FEE = 56,
    STATE_SURCHARGE = 57,
    AIRPORT_ACCESS_FEE = 58,
    CITY_TAX = 59,
    SERVICE_CHARGE = 60,
    PREMIUM_LOCATION_SURCHARGE = 61,
    LICENSE_RECOUPMENT_FEE = 62,
    TOURISM_CHARGE = 63,
    CONCESSION_FEE = 64,
    CUSTOMER_FACILITY_CHARGE = 65,
    AIRPORT_CONCESSION_FEE_RECOVERY = 66,
    FACILITY_FEE = 67,
    CONCESSION_RECOVERY_FEE = 68,
    BORDER_CROSSING_FEE = 69,
    COUNTY_TAX = 70,
    INFANT_CHILD_RESTRAINT_DEVICE_SURCHARGE = 71,
    REFUELING_SURCHARGE = 72,
    OUT_OF_HOURS_FEE = 73,
    MAINTENANCE_FACILITY_FEE = 74,
    ENERGY_SURCHARGE = 75,
    VEHICLE_MAINTENANCE_FEE = 76,
    TIRE_AND_BATTERY_FEE = 77,
    LESSOR_TAX = 78,
    AGE_DIFFERENTIAL = 79,
    REIMBURSEMENT_FEE = 80,
    SECURITY_FEE = 81,
    GOVERNMENT_RATE_SUPPLEMENT = 82,
    ROAD_SAFETY_PROGRAM_FEE = 83,
    TRANSACTION_FEE = 84,
    TOTAL_SURCHARGES = 85,
    AUTO_EXCISE = 86,
    CITY_MITIGATION_FEE = 87,
    CITY_PROJECT_FUND = 88,
    COUNTY_LICENSE_FEE = 89,
    COUNTY_SURCHARGE = 90,
    HIGHWAY_USE_CHARGE = 91,
    STATE_RENTAL_FEE = 92,
    STATE_TOURISM_FUND = 93,
    AIRPORT_CONSTRUCTION_FEE = 94,
    AIRPORT_CONTRACT_FEE = 95,
    MITIGATION_FEE = 96,
    ROAD_USAGE_SURCHARGE = 97,
    FREE_TANK = 98,
    PREPURCHASED_WITH_REFUND = 99,
    PREPURCHASED_WITH_NO_REFUND = 100,
    FULL_TO_FULL = 101,
    FULL_TO_EMPTY = 102,
    QUARTER_TO_EMPTY = 103,
    EMPTY_TO_EMPTY = 104,
    HALF_TO_HALF = 105,
    MILEAGE_INCLUDED = 106,
    SECOND_ADDITIONAL_DRIVER = 107,
    THIRD_ADDITIONAL_DRIVER = 108,
    ALL_ADDITIONAL_DRIVER = 109,
    ENVIRONMENTAL_SURCHARGE = 110,
    HIGH_SEASON_SURCHARGE = 111,
    CANCELLATION_FEE = 112,
    AMENDMENT_FEE = 113,
    VAT_TAX = 114,
    OTHER = 115,
    AIRPORT_SHUTTLE = 116,
    FUEL_AS_PICKUP = 117,
    ONE_WAY_FEE = 118,
    DROP = 119,
    SAME_TO_SAME = 120,
    SANITISATION_FEE = 121,
}

/**
 * Can be used to infer if the offer object is optional
 */
export enum BookingRequestStatusResponse {
    UNKNOWN_BOOKING_REQUEST_STATUS = 0,
    BOOK_REQUEST = 1,
    BOOK_CONFIRM = 2,
}

export enum DistanceTypeResponse {
    UNKNOWN_DISTANCE_TYPE = 0,
    KILOMETERS = 1,
    MILES = 2,
}

export enum EquipmentTypeResponse {
    UNKNOWN_EQUIPMENT_TYPE = 0,
    BABY_SEAT = 1,
    CHILD_SEAT = 2,
    BOOSTER_SEAT = 3,
    BIKE_RACK = 4,
    BABY_STROLLER = 5,
    ADDITIONAL_DRIVER_ALL = 6,
    ENTERTAINMENT_SYSTEM = 7,
    MOBILE_PHONE = 8,
    MOBILE_WIFI = 9,
    ROAD_MAPS = 10,
    ROOF_RACK = 11,
    SNOW_CHAINS = 12,
    SKI_RACK = 13,
    WINTER_TIRES = 14,
    WIFI = 15,
    GPS = 16,
    TRAILER = 17,
    TABLET = 18,
    VEHICLE_MONITORING_DEVICE = 19,
    AIR_CONDITIONING = 20,
    LUGGAGE_RACK = 21,
    HAND_CONTROL_RIGHT = 22,
    HAND_CONTROL_LEFT = 23,
    SPINNER_KNOB = 24,
    CARGO_BARRIER_FRONT = 25,
    CARGO_BARRIER_REAR = 26,
    LUGGAGE_TRAILER = 27,
    SATELLITE_RADIO = 28,
    WHEELCHAIR_ACCESSIBLE_VEHICLE = 29,
    SEAT_BELT_EXTENSIONS = 30,
    WINTER_PACKAGE = 31,
    CITIZEN_BAND_RADIO = 32,
    COMPUTERIZED_DIRECTIONS = 33,
    SKI_EQUIPPED = 34,
    TELEVISION = 35,
    PORTABLE_DVD_CD_PICTURE_PLAYER = 36,
    FLAG_HOLDER = 37,
    MOTORCYCLE_HELMET = 38,
    JERRYCAN = 39,
    LUGGAGE_ROOF_CASE = 40,
    HANDHELD_NAVIGATION_SYSTEM = 41,
    SNOW_BOARD_RACK = 42,
    SKI_BOX = 43,
    SURF_RACK = 44,
    SCOOTER_CASE = 45,
    CAR_TELEPHONE = 46,
    TOLL_PAYMENT_TAG_PASS = 47,
    ADDITIONAL_SPARE_TIRE = 48,
    WHEELCHAIR = 49,
    ROAD_CONGESTION_PAYMENT_SCHEME = 50,
    BOOSTER_CUSHION = 51,
    TROLLEY = 52,
    CARBON_OFFSET = 53,
    SECURITY_DEVICES = 54,
    TRAVEL_TAB = 55,
    BLUETOOTH_HANDSFREE = 56,
    DRIVER_SERVICE = 57,
    EXPRESS_PICKUP_SERVICE = 58,
    PREPAID_CLEANING_SERVICE = 59,
}

export enum HappycarPackageTypeResponse {
    UNKNOWN_PACKAGE_TYPE = 0,

    BASIC = 1,
    GOOD = 2,
    EXCELLENT = 3,
}

export enum CarTypeResponse {
    UNKNOWN_CAR_TYPE = 0,

    MINI = 1,
    ECONOMY = 2,
    COMPACT = 3,
    MIDDLE_INTERMEDIATE = 4,
    FULLSIZED_CLASS = 5,
    PREMIUM_CLASS = 6,
    CABRIO = 7,
    STATION_WAGON = 8,
    VAN = 9,
    SUV = 10,
    TRANSPORTER = 11,
    PICKUP = 12,
}

export enum PickUpTypeResponse {
    UNKNOWN_PICKUP_TYPE = 0,
    MEET_AND_GREET = 1,
    DESK_AT_PLACE = 2,
    SHUTTLE = 3,
}

export enum PaymentTypeResponse {
    UNKNOWN_PAYMENT_TYPE = 0,
    PAYMENT_TYPE_VISA = 1,
    PAYMENT_TYPE_MASTERCARD = 2,
    PAYMENT_TYPE_AMEX = 3,
}

export enum RateAdditionalResponse {
    UNKNOWN_CAR_ATTRIBUTE = 0,

    // If car is 4WD
    CAR_FOUR_WHEELS_DRIVE = 1,

    // If car fuels is Diesel
    CAR_FUEL_DIESEL = 2,
    CAR_GEAR_AUTOMATIC = 3,
    CAR_HYBRID = 4,

    // If the car model in the rate is guaranteed by the supplier
    CAR_MODEL_GUARANTEE = 5,
    RATE_UNLIMITED_KM = 6,
    RATE_NO_DEPOSIT = 7,

    RATE_WITH_CDW_WITHOUT_LIABILITY = 8,
    RATE_WITH_THEFT_WITHOUT_LIABILITY = 9,
    RATE_WITH_TPL_MINIMUM_COVERAGE = 10,

    CAR_ELECTRIC = 11,
}

enum AttachmentTypeResponse {
    UNKNOWN_ATTACHMENT_TYPE = 0,
    URL = 1,
    NAME = 2,
    PLAIN_TEXT = 3,
    HTML = 4,
    S3 = 5,
}

export enum SupplierClassificationResponse {
    UNKNOWN_SUPPLIER_CLASSIFICATION = 0,

    BAD_SUPPLIER = 1,
    REGULAR_SUPPLIER = 5,
    PREMIUM_SUPPLIER = 10,
}

export enum CoverageTypeResponse {
    UNKNOWN_COVERAGE_TYPE = 0,
    CDW = 1,
    THEFT = 2,
    UNDERBODY = 3,
    GLASS_AND_TIRE = 4,
    ROOF = 8,

    // These are not used on the backend
    GLASS = 6,
    TIRE = 7,
    CDW_THEFT = 12,

    // These third party are not used on the backend
    THIRD_PARTY = 5,
    CDW_THEFT_THIRD_PARTY = 11,
    CDW_THIRD_PARTY = 13,
    THEFT_THIRD_PARTY = 14,

    // These are not used on the backend
    PERSONAL_INJURY = 9,
    PROPERTY_DAMAGE = 10,
}

export enum BranchTypeResponse {
    UNKNOWN_TYPE_OF_BRANCH = 0,
    RAILWAY = 1,
    HOTEL = 2,
    AIRPORT = 3,
    FERRY = 4,
    CITY = 5,
}

interface LuggageResponse {
    readonly small: number;
    readonly large: number;
}

export interface CarResponse {
    readonly acriss: string;
    readonly description: string;
    readonly image: string;
    readonly luggage: LuggageResponse | null;
    readonly passengers: number;
    readonly mindoors: number;
    readonly maxdoors: number;
    readonly id: number;
}

export interface PriceResponse {
    readonly gross: number;
    readonly net: number;
    readonly currency: string;
    readonly timeofpayment: TimeOfPaymentResponse;
}

export interface ConditionalFeeResponse {
    readonly conditionalfeetype: ConditionalFeeTypeResponse;
    readonly included: boolean;
    readonly status: BookingRequestStatusResponse;
    readonly price: PriceResponse | null;
    readonly quantity: number;
    readonly unit: unknown;
    readonly esttax: PriceResponse | null;
}

export interface DistanceResponse {
    /**
     * Distance in any measure, -1 is unlimited
     */
    readonly distance: number;
    /**
     * Depends on what the provider has sent
     */
    readonly distancetype: DistanceTypeResponse;
}

interface AttachmentResponse {
    readonly data: string;
    readonly type: AttachmentTypeResponse;
}

export interface EquipmentResponse {
    readonly type: EquipmentTypeResponse;
    readonly included: boolean;
    readonly status: BookingRequestStatusResponse;
    readonly price: PriceResponse | null;
    readonly quantity: number;
    readonly maxquantity: number;
    readonly esttax: PriceResponse | null;
}

export interface ProviderResponse {
    readonly id: number;
    readonly image: string;
    readonly name: string;
    readonly terms: AttachmentResponse | null;
    readonly acceptedpaymenttypesList: PaymentTypeResponse[];
}

export interface SupplierRatingsResponse {
    readonly valformoney: number;
    readonly efficiency: number;
    readonly pickuptime: number;
    readonly dropofftime: number;
    readonly cleanliness: number;
    readonly condition: number;
    readonly locating: number;
    readonly count: number;
    readonly overall: number;
}

export interface SupplierResponse {
    readonly provider: ProviderResponse;
    readonly id: string;
    readonly name: string;
    readonly logourl: string;
    readonly countrycode: string;
    readonly countryname: string;
    readonly acceptedcurrencyList: string[];
    readonly terms: AttachmentResponse | null;
    readonly supplierid: number;
    readonly classification: SupplierClassificationResponse;
    readonly customerratings: SupplierRatingsResponse | null;
    readonly islogoallowed: boolean;
    readonly isnameallowed: boolean;
}

interface CarInsuranceResponse {
    readonly coverage: CoverageTypeResponse;
    readonly coverageprice: PriceResponse | null;
    /**
     * How much it costs [null/0 if already included]
     */
    readonly price: PriceResponse | null;
    readonly attachmentsList: AttachmentResponse[];
    /**
     * -1 => Excess coverage is unknown
     * 0 => Unlimited excess coverage
     * Other values => Limited excess coverage to value
     */
    readonly excess: PriceResponse;
}

interface ThirdpartyinsuranceResponse {
    /**
     * How much it costs [null/0 if already included]
     */
    readonly price: PriceResponse | null;
    /**
     * Excess Coverage
     *
     * 0 => unlimited
     */
    readonly limit: number;
}

export interface InsuranceResponse {
    readonly carinsurancesList: CarInsuranceResponse[];
    /**
     * Third party insurance - Personal Damage
     */
    readonly thirdpartyinsurance: ThirdpartyinsuranceResponse | null;
}

interface OpeningTimesResponse {
    readonly monday: number;
    readonly tuesday: number;
    readonly wednesday: number;
    readonly thursday: number;
    readonly friday: number;
    readonly saturday: number;
    readonly sunday: number;
    readonly pickupdropoffday: number;
}

interface CoordinatesResponse {
    readonly latitude: number;
    readonly longitude: number;
}

interface BranchLocationAddressResponse {
    readonly city: string;
    readonly country: string;
    readonly street: string;
    readonly postcode: string;
    readonly isocountrycode: string;
}

interface BranchLocationResponse {
    readonly coordinates: CoordinatesResponse;
    readonly iata: string;
    readonly address: BranchLocationAddressResponse | null;
}

export interface MapBranchResponse {
    readonly branchId: string;
    readonly coordinates: CoordinatesResponse;
    readonly stationName: string | null;
    readonly stationType: BranchTypeResponse;
    readonly minprice: number;
    readonly iata: string;
}

export interface BranchResponse {
    readonly id: string;
    readonly name: string;
    readonly address: string;
    readonly addresstwo: string;
    readonly location: BranchLocationResponse;
    readonly phone: string;
    readonly email: string;
    readonly openingtimes: OpeningTimesResponse | null;
    readonly currenciesList: string[];
    readonly mandatoryflight: false;
    readonly typeofbranch: BranchTypeResponse;

    readonly pickuptype: PickUpTypeResponse;
    readonly pickupnote: string;
    readonly supplier: SupplierResponse | null;
    readonly allowoneway: boolean;
}

interface ConstraintsResponse {
    readonly minage: number;
    readonly maxage: number;
    readonly minlicenceyears: number;
}

interface SafetyDepositResponse {
    readonly price: PriceResponse | null;
    readonly refundable: boolean;
    readonly text: unknown;
}

export interface RateAdditionalsResponse {
    readonly isAutomatic: boolean;
    readonly isUnlimited: boolean;
    readonly is4Wd: boolean;
    readonly isFuelDiesel: boolean;
    readonly isFuelHybrid: boolean;
    readonly isCarModelGuaranteed: boolean;
    readonly isRateWithoutDeposit: boolean;
    readonly isRateWithCDWWithoutLiability: boolean;
    readonly isRateWithTheftWithoutLiability: boolean;
}

export interface ExtraInformationResponse {
    readonly happycarRateIdentifier: string;
    readonly happycarPackage: HappycarPackageTypeResponse;
    readonly happycarCarType: CarTypeResponse;
    readonly rateAdditionals: RateAdditionalsResponse;
}

export interface OfferResponse {
    // Rate Id
    readonly uniqueidentifier: string;
    readonly car: CarResponse;

    readonly _id: string;

    readonly conditionalfeesList: ConditionalFeeResponse[];
    readonly distance: DistanceResponse;
    readonly equipmentsList: EquipmentResponse[];
    readonly includedinsurance: InsuranceResponse | null;
    readonly optionalinsurance: InsuranceResponse | null;

    readonly baseprice: PriceResponse;
    readonly totalprice: PriceResponse;
    readonly paynow: PriceResponse | null;
    readonly paydesk: PriceResponse | null;

    readonly pickupbranch: BranchResponse;
    readonly dropoffbranch: BranchResponse;

    // Base64 of a json, used on BE
    readonly additionaldata: string;
    readonly provider: ProviderResponse;

    readonly safetydeposit: SafetyDepositResponse | null;

    readonly supplier: SupplierResponse | null;
    // Hashed provider rate id
    readonly identifier: string;
    readonly constraints: ConstraintsResponse | null;
    readonly searchId: string;
    readonly createdAt: string;
    readonly expiresAt: string;

    readonly extraInformation: ExtraInformationResponse;
}

interface RatesResponse {
    readonly totalRates: number;
    readonly standard: OfferResponse[];
}

export interface PaginationResponse {
    readonly totalPages: number;
    readonly ratesPerPage: number;
}

export interface FilterResponse {
    readonly selected: boolean;
    readonly minprice: number;
}

export type HappyPackageFilterResponse = FilterResponse & {
    readonly happycarpackage: HappycarPackageTypeResponse;
    readonly image: string;
};

export type IataFilterResponse = FilterResponse & { readonly iata: string };
export type PickUpTypeFilterResponse = FilterResponse & { readonly pickuptype: PickUpTypeResponse };
export type EquipmentTypeFilterResponse = FilterResponse & { readonly equipment: EquipmentTypeResponse };
export type ConditionalFeeTypeFilterResponse = FilterResponse & { readonly conditionalfee: ConditionalFeeTypeResponse };
export type CoverageTypeFilterResponse = FilterResponse & { readonly coverage: CoverageTypeResponse };
export type CarTypeFilterResponse = FilterResponse & { readonly cartype: CarTypeResponse };
export type SupplierFilterResponse = FilterResponse & {
    readonly supplier: Omit<SupplierResponse, 'terms' | 'customerratings' | 'provider'>;
};
export type ProviderFilterResponse = FilterResponse & { readonly provider: Omit<ProviderResponse, 'terms'> };
export type PaymentTypeFilterResponse = FilterResponse & { readonly paymenttype: PaymentTypeResponse };
export type MaxPassengersFilterResponse = FilterResponse & { readonly maximumpassengers: number };
export type AdditionalFilterResponse = FilterResponse & { readonly additional: RateAdditionalResponse };

interface BaseFiltersResponse {
    readonly iatasList: IataFilterResponse[];
    readonly pickuptypesList: PickUpTypeFilterResponse[];
    readonly equipmentsList: EquipmentTypeFilterResponse[];
    readonly conditionalfeesList: ConditionalFeeTypeFilterResponse[];
    readonly coveragesList: CoverageTypeFilterResponse[];
    readonly cartypesList: CarTypeFilterResponse[];
    readonly suppliersList: SupplierFilterResponse[];
    readonly providersList: ProviderFilterResponse[];
    readonly paymenttypesList: PaymentTypeFilterResponse[];
    readonly maximumpassengersList: MaxPassengersFilterResponse[];
    readonly pickupbranchidsList: string[];
    readonly dropoffbranchidsList: string[];
    readonly additionalsList: AdditionalFilterResponse[];
}

export interface FiltersResponse extends BaseFiltersResponse {
    readonly happycarpackagesList: HappyPackageFilterResponse[];
}

interface RatesProgressResponse {
    // Out of a 100
    readonly progress: number;
}

export interface HCRatesApiResponse {
    readonly rates: RatesResponse;
    readonly filters: FiltersResponse;
    readonly pagination: PaginationResponse;
    readonly status: RatesProgressResponse;
}

export interface HCRatesApiFilterRequest {
    readonly carTypes?: CarTypeResponse[];
    readonly conditionalFees?: ConditionalFeeTypeResponse[];
    readonly coverages?: CoverageTypeResponse[];
    readonly equipments?: EquipmentTypeResponse[];
    readonly iatas?: string[];
    readonly packages?: HappycarPackageTypeResponse[];
    readonly packageOptions?: (ConditionalFeeTypeResponse | CoverageTypeResponse | RateAdditionalResponse)[];
    readonly passengers?: number;
    readonly paymentTypes?: PaymentTypeResponse[];
    readonly pickupTypes?: PickUpTypeResponse[];
    readonly providers?: ProviderResponse['id'][];
    readonly suppliers?: SupplierResponse['supplierid'][];
    readonly additionals?: RateAdditionalResponse[];
    readonly pickupBranches?: string;
    readonly dropoffBranches?: string;
}

export enum HCRatesSort {
    PRICE_ASC = 'PRICE_ASC',
}

export interface HCRatesApiRequest {
    readonly sort?: HCRatesSort;
    readonly filter?: HCRatesApiFilterRequest;
    readonly onlyFilter?: boolean;
}

export enum CurrencyCode {
    CHF = 'CHF', // Swiss Franc
    EUR = 'EUR',
    PLN = 'PLN', // Polish złoty
    USD = 'USD', // US Dollar
}

export interface LocationResponse {
    readonly name: string;
    readonly iata?: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly autocompleteData?: HCAutocompleteSuggestionResponse;
}

export interface SearchResponse {
    readonly id: number | null;
    readonly key: string | null;
    readonly userId: string | null;
    readonly platform: string | null;
    readonly driverAge: string | null;
    readonly pickUpDate: string | null;
    readonly dropOffDate: string | null;
    readonly userIpAddress: string | null;
    readonly pickUpLocation: LocationResponse | null;
    readonly dropOffLocation: LocationResponse | null;
    readonly created: string;
    readonly expiresAt: string;
    readonly userDevice: {
        readonly isMobile: boolean;
        readonly device: string;
        readonly userAgent: string;
    };
}

export interface HappyPackageConfigurationResponse
    extends Omit<
        BaseFiltersResponse,
        'iatasList' | 'pickuptypesList' | 'pickupbranchidsList' | 'dropoffbranchidsList'
    > {
    readonly happycarpackage: HappycarPackageTypeResponse;
}

export interface HCRatesApiConfigurationResponse {
    readonly endpoints: {
        readonly homePageUrl: string;
    };
    readonly distanceUnit: 'km' | 'mi';
    readonly currencyCode: CurrencyCode;
    readonly initialRentalAge: number;
    readonly defaultImageUrl: string;
    readonly rentalAges: { [key: number]: string };
    readonly packages: HappyPackageConfigurationResponse[];
    readonly search: SearchResponse;
    readonly providersConfiguration: {
        readonly clickout: ProviderResponse['id'][];
        readonly sanitizationGuarantee: ProviderResponse['id'][];
        readonly logos: {
            [id: number]: { readonly logoUrl: string; readonly overwriteSupplierImage: boolean };
        };
    };
    readonly loadingSuppliers: LoadingSupplierResponse[];
    readonly carTypesDetails: CarTypesDetailsResponse[];
}

export interface HCMapResponse {
    readonly cheapestByDropOffBranch: MapBranchResponse[];
    readonly cheapestByPickUpBranch: MapBranchResponse[];
}

export interface TermsResponse {
    readonly data: string;
}

export interface StartSearchRequest {
    readonly platform: string;
    readonly driverAge: number;
    readonly pickUpDate: string;
    readonly dropOffDate: string;
    readonly pickUpLocation: LocationResponse;
    readonly dropOffLocation: LocationResponse;
    readonly user?: { readonly id?: string };
}

export interface StartSearchResponse {
    readonly key: string;
}

export interface LoadingSupplierResponse {
    readonly name: string;
    readonly logoUrl: string;
}

export interface CarTypesDetailsResponse {
    readonly carType: CarTypeResponse;
    readonly availableSeats: string;
    readonly imageUrl: string;
    readonly luggage: {
        readonly small?: number | string;
        readonly large?: number | string;
    };
}
