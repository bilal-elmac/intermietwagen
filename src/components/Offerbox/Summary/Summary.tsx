import React, { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { FuelPolicy, Mileage, Offer } from '../../../domain/Offer';
import { Insurance, ThirdPartyInsurance, CarInsurance } from '../../../domain/Insurance';
import { Supplier } from '../../../domain/Supplier';
import { Price } from '../../../domain/Price';

import { RentalConditionsPanelTabs } from '../CollapsableSection/Panel';
import ExtrasList from '../ExtrasList';

import IconAvailability, { AvailabilityStatus } from '../../../ui/IconAvailability';
import PriceLabel from '../../../ui/PriceLabel';
import Tooltip from '../../../ui/Tooltip';

import { boldFormatter } from '../../../utils/FormatterUtils';

interface Props
    extends Pick<Offer, 'mileage' | 'insurances' | 'supplier' | 'fuelPolicy' | 'extras' | 'hasSanitationGuarantee'> {
    readonly offerBoxClass: string;
    readonly openTab: (tab: RentalConditionsPanelTabs) => void;
}

type SummaryItemConf = {
    readonly status: AvailabilityStatus;
    readonly label: string;
    readonly values?: { [i: string]: React.ReactNode };
    readonly tooltip?: string | RentalConditionsPanelTabs;
};

type LiabilityCoverage = 'unknown' | 'finite' | 'infinite';
const mapLiabilityCoverage = (liability: Price | null): LiabilityCoverage => {
    if (liability === null) {
        return 'unknown';
    }

    if (isFinite(liability.value)) {
        return 'finite';
    }

    return 'infinite';
};

const reduceLiabilityCoverage = (a: LiabilityCoverage, b: LiabilityCoverage): LiabilityCoverage => {
    if (a === b) {
        return a;
    }

    const coverages = [a, b];
    return coverages.find(c => c === 'unknown') || coverages.find(c => c === 'finite') || 'infinite';
};

const generateThirdPartyConf = (insurances: Insurance[]): SummaryItemConf[] => {
    const thirdParty = insurances.find(
        (insurance): insurance is ThirdPartyInsurance => insurance.insuranceType === 'THIRD_PARTY',
    );

    const liabilityCoverage = thirdParty ? mapLiabilityCoverage(thirdParty.liability) : null;
    const liabilityCoverageSum = thirdParty?.liability?.value ? thirdParty.liability : null;

    return [
        {
            status: AvailabilityStatus.INFO,
            label: 'OFFER_BOX_FEATURE_THIRD_PARTY',
            tooltip: 'OFFER_BOX_FEATURE_THIRD_PARTY_TOOLTIP',
            values: {
                liabilityCoverage,
                coverageSum: liabilityCoverageSum ? <PriceLabel {...liabilityCoverageSum} alwaysHideDecimals /> : '',
            },
        },
    ];
};

const generateMileageConf = (mileage: Mileage): SummaryItemConf => {
    const { formatNumber } = useIntl();
    if (mileage.included === null) {
        return {
            status: AvailabilityStatus.INFO,
            label: 'OFFER_BOX_FEATURE_UNLIMITED_DISTANCE',
            tooltip: 'OFFER_BOX_FEATURE_UNLIMITED_DISTANCE_TOOLTIP',
            values: {
                distanceUnit: mileage.distanceUnit,
            },
        };
    }

    return {
        status: AvailabilityStatus.WARNING,
        label: 'OFFER_BOX_FEATURE_LIMITED_DISTANCE',
        tooltip: 'OFFER_BOX_FEATURE_LIMITED_DISTANCE_TOOLTIP',
        values: {
            distanceUnit: mileage.distanceUnit,
            included: formatNumber(Math.floor(mileage.included)),
            afterIncluded: <PriceLabel {...mileage.pricePerAdditional} alwaysShowDecimals />,
        },
    };
};

const generateFullbodyConf = (insurances: Insurance[]): SummaryItemConf[] => {
    const { formatMessage } = useIntl();

    // Retrieve body insurances
    const [glassTiresTypes, underbodyRoofTypes] = insurances.reduce(
        (set, { insuranceType }) => {
            if (insuranceType === 'GLASS' || insuranceType === 'TIRES') {
                set[0].add(insuranceType);
            }
            if (insuranceType === 'ROOF' || insuranceType === 'UNDERBODY') {
                set[1].add(insuranceType);
            }
            return set;
        },
        [new Set<CarInsurance['insuranceType']>(), new Set<CarInsurance['insuranceType']>()],
    );

    // Translate labels
    const insuranceLabels = (types: CarInsurance['insuranceType'][]): string[] =>
        types.map(t => formatMessage({ id: `OFFER_BOX_FEATURE_${t}` })).sort();

    // Most providers do not send us roof information, so even without it, the offer is well insured
    const isBodyInsured = underbodyRoofTypes.has('UNDERBODY');
    const isGlassTiresInsured = glassTiresTypes.has('GLASS') && glassTiresTypes.has('TIRES');

    return [
        {
            status: isBodyInsured ? AvailabilityStatus.INFO : AvailabilityStatus.WARNING,
            label: 'OFFER_BOX_FEATURE_ROOF_AND_UNDERBODY_INSURANCE',
            tooltip: 'OFFER_BOX_FEATURE_ROOF_AND_UNDERBODY_INSURANCE_TOOLTIP',
            values: {
                insured: insuranceLabels(Array.from(underbodyRoofTypes)),
                coverage: underbodyRoofTypes.size,
            },
        },
        {
            status: isGlassTiresInsured ? AvailabilityStatus.INFO : AvailabilityStatus.WARNING,
            label: 'OFFER_BOX_FEATURE_GLASS_AND_TIRES_INSURANCE',
            tooltip: 'OFFER_BOX_FEATURE_GLASS_AND_TIRES_INSURANCE_TOOLTIP',
            values: {
                insured: insuranceLabels(Array.from(glassTiresTypes)),
                coverage: glassTiresTypes.size,
            },
        },
    ];
};

const generateTheftAndCDWConf = (insurances: Insurance[]): SummaryItemConf => {
    let cdwLiabilityCoverage: LiabilityCoverage | null = null;
    let theftLiabilityCoverage: LiabilityCoverage | null = null;
    let excessCoverage: Price | null = null;

    for (const insurance of insurances) {
        if (insurance.insuranceType === 'CDW') {
            cdwLiabilityCoverage = mapLiabilityCoverage(insurance.liability);
            excessCoverage = insurance.coveragePrice;
        }
        if (insurance.insuranceType === 'THEFT') {
            theftLiabilityCoverage = mapLiabilityCoverage(insurance.liability);
            excessCoverage = excessCoverage || insurance.coveragePrice;
        }
    }

    const liabilityCoverage =
        cdwLiabilityCoverage &&
        theftLiabilityCoverage &&
        reduceLiabilityCoverage(theftLiabilityCoverage, cdwLiabilityCoverage);

    return {
        status: liabilityCoverage === 'infinite' ? AvailabilityStatus.INFO : AvailabilityStatus.WARNING,
        label: 'OFFER_BOX_FEATURE_THEFT_CDW',
        tooltip: 'OFFER_BOX_FEATURE_THEFT_CDW_TOOLTIP',
        values: {
            liabilityCoverage: liabilityCoverage || 'not available',
            excessCoverage:
                excessCoverage && excessCoverage?.value > 0 ? (
                    <>
                        (<PriceLabel {...excessCoverage} alwaysHideDecimals />)
                    </>
                ) : (
                    ''
                ),
        },
    };
};

const generateBadSupplierConf = (supplier: Supplier | null): SummaryItemConf[] => {
    if (supplier && supplier.isBad) {
        return [
            {
                status: AvailabilityStatus.WARNING,
                label: 'OFFER_BOX_WARNING_BAD_SUPPLIER',
            },
        ];
    }

    return [];
};

const generateFuelPolicyConf = (fuelPolicy: FuelPolicy): SummaryItemConf[] => {
    switch (fuelPolicy) {
        case 'f2f':
            return [
                {
                    status: AvailabilityStatus.INFO,
                    tooltip: 'OFFER_BOX_FEATURE_FUEL_POLICY_F2F_TOOLTIP',
                    label: 'OFFER_BOX_FEATURE_FUEL_POLICY_F2F',
                },
            ];
        case 'f2e':
            return [
                {
                    status: AvailabilityStatus.WARNING,
                    tooltip: 'OFFER_BOX_FEATURE_FUEL_POLICY_F2E_TOOLTIP',
                    label: 'OFFER_BOX_FEATURE_FUEL_POLICY_F2E',
                },
            ];
    }

    return [];
};

const generateSanitation = (hasSanitationGuarantee: boolean): SummaryItemConf[] =>
    hasSanitationGuarantee
        ? [
              {
                  status: AvailabilityStatus.INFO,
                  label: 'OFFER_BOX_FEATURE_SANITATION',
                  tooltip: RentalConditionsPanelTabs.SANITATION,
              },
          ]
        : [];

const order: Record<AvailabilityStatus, number> = {
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
};

const ItemMessage: React.FC<{ label: string; values: SummaryItemConf['values'] }> = ({
    label,
    values,
}): JSX.Element | null => (
    <FormattedMessage
        id={label}
        values={{
            ...values,
            b: boldFormatter,
        }}
    />
);

const ItemWrapper = ({ children, param }: { children: ReactNode; param: JSX.Element | VoidFunction }): JSX.Element =>
    typeof param === 'function' ? (
        <p className="cursor-pointer" onClick={param}>
            {children}
        </p>
    ) : (
        <Tooltip content={param}>{children}</Tooltip>
    );

export const Summary: React.FC<Props> = ({
    offerBoxClass,
    mileage,
    insurances,
    fuelPolicy,
    extras,
    supplier,
    hasSanitationGuarantee,
    openTab,
}): JSX.Element => {
    const summary: SummaryItemConf[] = [
        ...generateThirdPartyConf(insurances),
        generateMileageConf(mileage),
        generateTheftAndCDWConf(insurances),
        ...generateFullbodyConf(insurances),
        ...generateBadSupplierConf(supplier),
        ...generateFuelPolicyConf(fuelPolicy),
        ...generateSanitation(hasSanitationGuarantee),
    ];

    summary.sort((a, b) => order[a.status] - order[b.status]);

    return (
        <div className={`${offerBoxClass}__availability-container`}>
            <ul>
                {summary.map(({ status, label, values, tooltip }, k) => (
                    <li key={k}>
                        <ItemWrapper
                            param={
                                typeof tooltip === 'string' ? (
                                    <ItemMessage label={tooltip} values={values} />
                                ) : (
                                    (): void => tooltip && openTab(tooltip)
                                )
                            }
                        >
                            <IconAvailability status={status}>
                                <ItemMessage label={label} values={values} />
                            </IconAvailability>
                        </ItemWrapper>
                    </li>
                ))}
            </ul>
            {extras && <ExtrasList extras={extras} offerBoxClass={offerBoxClass} />}
        </div>
    );
};
