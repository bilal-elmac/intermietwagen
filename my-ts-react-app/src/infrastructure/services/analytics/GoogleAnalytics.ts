import ReactGA from 'react-ga';

import { PackageType } from '../../../domain/OfferPackage';
import { VehicleCategory, PaymentMethod, CarFeatureType, InsuranceType } from '../../../domain/Filter';
import { Supplier } from '../../../domain/Supplier';
import { Provider } from '../../../domain/Provider';
import { AutocompleteSuggestion } from '../../../domain/Autocomplete';

import { AnalyticsService } from '../../../services/AnalyticsService';
import { StationInteractionType } from '../../../domain/Station';
import { RentalConditionsPanelTabs } from '../../../components/Offerbox/CollapsableSection/Panel';

type AnalyticsCategory =
    | 'errors'
    | 'filters'
    | 'banners'
    | 'help_menu'
    | 'result_view_version'
    | 'one_way'
    | 'round_trip_map'
    | 'terms_and_conditions';

type AnalyticsLabel =
    | 'opened_menu'
    | 'HAPPYCAR_brand'
    | 'comfort_options'
    | 'insurances'
    | 'package_filter_top'
    | 'package_filter_mid'
    | 'package_filter_bottom'
    | 'passengers'
    | 'payment_methods'
    | 'provider'
    | 'rental_company'
    | 'supplier_carousel'
    | 'page_number'
    | 'car_category'
    | 'search_parameters'
    | 'pickup_location'
    | 'package_filter'
    | 'currencies_missmatch_error'
    | 'unexpected_mapping_scenario_error'
    | 'unexpected_persisted_data_error'
    | 'unexpected_state_error'
    | 'data_load_error'
    | 'start_search_error'
    | 'autocomplete_data_load_error'
    | 'terms_data_load_error'
    | 'configuration_data_load_error'
    | 'unexpected_error'
    | 'slow_render'
    | 'offer_box'
    | 'offer_box_first_tap'
    | 'new_view'
    | 'pick_up'
    | 'drop_off'
    | 'single_station'
    | 'terms_and_conditions_box'
    | 'scrolling'
    | 'tab_click'
    | 'popular_search'
    | 'custom_search'
    | 'search_match_cycle'
    | 'top_refresh_results'
    | 'bottom_refresh_results';

export type PackageFilterLocation = 'top' | 'mid' | 'bottom';

/**
 * Adds custom tracking event
 *
 * @param {AnalyticsCategory} category
 * @param {AnalyticsLabel} label
 * @param {string} action
 */
const sendEvent = (category: AnalyticsCategory, label: AnalyticsLabel, action: string): void =>
    ReactGA.event({ category, action, label });

/**
 * Registers page view
 *
 * @param path
 */
const sendPageview = (path: string): void => ReactGA.pageview(path);

const insurancesFiltersToEventsMap: Record<InsuranceType, string> = {
    CDW_AND_THEFT_PROTECTION_WITHOUT_LIABILITY: 'CDW',
    GLASS_AND_TIRE: 'glass_tires',
    UNDERBODY: 'underbody',
    RATE_WITH_TPL_MINIMUM_COVERAGE: 'best_liability',
};

const paymentMethodsFiltersToEventsMap: Record<PaymentMethod, string> = {
    AMEX: 'amex',
    VISA: 'visa',
    MASTERCARD: 'mastercard',
};

const carFeaturesFiltersToEventsMap: Record<CarFeatureType, string> = {
    AIR_CONDITIONER: 'AC',
    AUTOMATIC: 'automatic',
    WINTER_TIRES: 'winter_tires',
    FOUR_WHEELS: 'FWD',
    DIESEL: 'diesel',
    FULL_TO_FULL_FUEL_POLICY: 'full2full_fuel',
    ADDITIONAL_DRIVER: 'additional_driver',
    UNLIMITED_DISTANCE: 'unlimited_milage',
    CAR_MODEL_GUARANTEE: 'car_model_guarantee',
    HYBRID: 'hybrid',
    ELECTRIC: 'electric',
};

const vehicleCategoryOverride = new Map<VehicleCategory, string>([['CABRIO', 'CONVERTIBLE']]);

const mapStationTypeToEventsMap: Record<StationInteractionType, AnalyticsLabel> = {
    pickUp: 'pick_up',
    dropOff: 'drop_off',
};

const mapOfferboxTabToEventsMap: Record<RentalConditionsPanelTabs, string> = {
    1: 'car_specifications',
    2: 'customer_ratings',
    3: 'rental_terms_and_conditions',
    4: 'price_details',
    5: 'sanitary_measures',
};

const mapMapTypeToEventsMap = (isOneWay: boolean): AnalyticsCategory => (isOneWay ? 'one_way' : 'round_trip_map');

export class GoogleAnalytics implements AnalyticsService {
    private sentKeys: { [key: string]: Set<string> };

    constructor(trackingId: string | null) {
        if (trackingId) {
            ReactGA.initialize(trackingId);
        } else {
            console.warn('Not tracking google analytics. Id is unavailable');
        }
        this.sentKeys = {
            sentStations: new Set(),
            sentOffers: new Set(),
            searchedTerms: new Set(),
        };
    }

    onAutoCompleteSuggestionSelected(suggestion: AutocompleteSuggestion): void {
        sendPageview(`/search_results.php?q=${suggestion.name}`);
    }

    onGoToOffer(isHappyCar: boolean, isFirstStep = false): void {
        const destination = isHappyCar ? 'internal' : 'clickout';
        const label = isFirstStep ? 'offer_box_first_tap' : 'offer_box';
        sendEvent('banners', label, destination);
    }

    onPickUpLocationChange(): void {
        sendEvent('banners', 'search_parameters', 'edit_pickup_loc');
    }

    onDropOffLocationChange(): void {
        sendEvent('banners', 'search_parameters', 'edit_dropoff_loc');
    }

    onPickUpDateChange(): void {
        sendEvent('banners', 'search_parameters', 'edit_pickup_date');
    }

    onDropOffDateChange(): void {
        sendEvent('banners', 'search_parameters', 'edit_dropoff_date');
    }

    onTimeChange(): void {
        sendEvent('banners', 'search_parameters', 'edit_time');
    }

    onHelpMenuOpened(): void {
        sendEvent('help_menu', 'opened_menu', 'opened');
    }

    onFirstPageLoadEvent(): void {
        sendPageview('/funnel/wait4results');
        sendEvent('result_view_version', 'new_view', 'new_view');
    }

    onFirstDataLoadEvent(): void {
        sendPageview('/funnel/results');
    }

    onBannerCloseEvent(): void {
        sendEvent('banners', 'HAPPYCAR_brand', 'closed');
    }

    onCarFeaturesFilterSelected(feature: CarFeatureType): void {
        sendEvent('filters', 'comfort_options', carFeaturesFiltersToEventsMap[feature]);
    }

    onInsurancesFilterSelected(insurance: InsuranceType): void {
        sendEvent('filters', 'insurances', insurancesFiltersToEventsMap[insurance]);
    }

    onLocationFilterSelected(isAirport: boolean): void {
        sendEvent('filters', 'pickup_location', isAirport ? 'airport_pickup' : 'city_pickup');
    }

    onPackagesBannerSelected(packageType: PackageType, location: PackageFilterLocation): void {
        sendEvent('banners', `package_filter_${location}` as AnalyticsLabel, packageType.toLowerCase());
    }

    onPaginationClick(currentPage: number, nextPage: number): void {
        const diff = nextPage - currentPage;
        let action = String(nextPage);
        switch (diff) {
            case 1:
                action = 'next';
                break;
            case -1:
                action = 'back';
                break;
        }

        sendEvent('banners', 'page_number', action);
    }

    onPassengersFilterSelected(passengers: number): void {
        sendEvent('filters', 'passengers', String(passengers));
    }

    onPaymentMethodsFilterSelected(paymentMethod: PaymentMethod): void {
        sendEvent('filters', 'payment_methods', paymentMethodsFiltersToEventsMap[paymentMethod]);
    }

    onProvidersFilterSelected(provider: Provider): void {
        sendEvent('filters', 'provider', provider.name);
    }

    onSuppliersCarouselSelected(supplier: Supplier): void {
        if (supplier.rawName) {
            sendEvent('banners', 'supplier_carousel', supplier.rawName);
        }
    }

    onSuppliersFilterSelected(supplier: Supplier): void {
        if (supplier.rawName) {
            sendEvent('filters', 'rental_company', supplier.rawName);
        }
    }

    onVehicleCategoriesFilterSelected(category: VehicleCategory): void {
        sendEvent('filters', 'car_category', (vehicleCategoryOverride.get(category) || category).toLowerCase());
    }

    onStationSelected(label: StationInteractionType, isCluster: boolean, isOneWay: boolean): void {
        const key = `station_selected_${label}`;
        if (this.sentKeys.sentStations.has(key)) {
            // when we need to send event only once
            return;
        }

        this.sentKeys.sentStations.add(key);
        sendEvent(
            mapMapTypeToEventsMap(isOneWay),
            isOneWay ? mapStationTypeToEventsMap[label] : 'single_station',
            isCluster ? 'station_grouping_map' : 'station_summary_map',
        );
    }

    onStationRemoved(label: StationInteractionType): void {
        const key = `station_removed_from_box_${label}`;
        if (this.sentKeys.sentStations.has(key)) {
            return;
        }

        this.sentKeys.sentStations.add(key);
        sendEvent('one_way', mapStationTypeToEventsMap[label], 'station_removed_from_box');
    }

    onMapAirportSelected(label: StationInteractionType): void {
        const key = `station_summary_box_click_${label}`;
        if (this.sentKeys.sentStations.has(key)) {
            return;
        }

        this.sentKeys.sentStations.add(key);
        sendEvent('one_way', mapStationTypeToEventsMap[label], 'station_summary_box_click');
    }

    onMapNavigationStepChange(label: StationInteractionType, step: 1 | 2, isOneWay: boolean): void {
        const actions = ['return_station_button', 'search_offers_button'];

        sendEvent(mapMapTypeToEventsMap(isOneWay), mapStationTypeToEventsMap[label], actions[step - 1]);
    }

    onMapStationTypeChange(label: StationInteractionType): void {
        sendEvent('one_way', mapStationTypeToEventsMap[label], 'direction_banner_click');
    }

    onTermsAndConditionsToggle(isOpen: boolean): void {
        sendEvent('terms_and_conditions', 'terms_and_conditions_box', isOpen ? 'opened' : 'closed');
    }

    onTermsAndConditionsTabOpen(tab: RentalConditionsPanelTabs): void {
        sendEvent('terms_and_conditions', 'tab_click', mapOfferboxTabToEventsMap[tab]);
    }

    onTermsAndConditionsScroll(isScrolledToEnd: boolean, rateId: string): void {
        const key = `scrolled_TC_${rateId}_${isScrolledToEnd ? 'toEnd' : ''}`;
        if (this.sentKeys.sentOffers.has(key)) {
            return;
        }

        this.sentKeys.sentOffers.add(key);
        sendEvent('terms_and_conditions', 'scrolling', isScrolledToEnd ? 'scrolled_to_bottom' : 'scrolled');
    }

    onTermsAndConditionsSearchTerm(term: string, isCustom: boolean): void {
        if (term.length < 3) {
            return;
        }
        const key = `searched_term_${term}`;
        if (this.sentKeys.searchedTerms.has(key)) {
            return;
        }
        const label = isCustom ? 'custom_search' : 'popular_search';

        this.sentKeys.searchedTerms.add(key);
        sendEvent('terms_and_conditions', label, term);
    }

    onTermsAndConditionsSearchCycle(term: string): void {
        sendEvent('terms_and_conditions', 'search_match_cycle', term);
    }

    onLoadBufferedOffers(location: 'top' | 'bottom'): void {
        sendEvent('banners', location === 'top' ? 'top_refresh_results' : 'bottom_refresh_results', 'click');
    }
}
