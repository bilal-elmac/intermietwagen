import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { SvgIcon } from '@material-ui/core';

import { StationType } from '../../../domain/Station';
import { Price } from '../../../domain/Price';

import PriceLabel from '../../../ui/PriceLabel';
import Checkbox from '../../../ui/Checkbox';

const BASE_CLASS = 'hc-results-view__map__custom-marker';

type IconProps = { className: string };

const MarkerBlueArrow = (): JSX.Element => (
    <SvgIcon viewBox="0 0 21 29">
        <path
            fill="#2479D3"
            fillRule="evenodd"
            d="M10.357 29h-.002c-.778 0-1.51-.4-1.955-1.068l-.384-.577c-.077-.118-1.947-2.925-3.877-6.35C1.315 15.993 0 12.6 0 10.323 0 4.631 4.647 0 10.357 0c5.71 0 10.357 4.63 10.357 10.323 0 2.277-1.315 5.67-4.139 10.682-1.779 3.156-3.534 5.832-3.866 6.336l-.395.592c-.447.669-1.18 1.067-1.957 1.067"
        />
    </SvgIcon>
);

const RailwayIcon = (props: IconProps): JSX.Element => (
    <div {...props}>
        <SvgIcon viewBox="0 0 10 13">
            <path
                fill="#FFF"
                fillRule="evenodd"
                d="M7.99 8.424h-.746c-.413 0-.747-.329-.747-.736s.334-.736.747-.736h.747c.412 0 .746.33.746.736 0 .407-.334.736-.746.736zm-5.484 0H1.76c-.413 0-.747-.329-.747-.736s.334-.736.747-.736h.746c.413 0 .747.33.747.736 0 .407-.334.736-.747.736zm-.73-5.962c0-.118.096-.212.215-.212H7.76c.118 0 .214.094.214.212v2.205c0 .117-.096.212-.214.212H1.99c-.118 0-.214-.095-.214-.212V2.462zM0 2.403V9.26c0 .54.244 1.021.61 1.321h.923l-.698 1.376c-.18.356-.034.789.327.967.105.051.216.076.326.076.268 0 .527-.146.655-.399l1.023-2.02h3.56l1.024 2.02c.128.253.386.399.654.399.11 0 .222-.025.327-.076.36-.178.507-.611.326-.967l-.697-1.376h.78c.366-.3.61-.78.61-1.321V2.403C9.75.3 7.556 0 4.875 0 2.195 0 0 .3 0 2.403z"
            />
        </SvgIcon>
    </div>
);

const AirportIcon = (props: IconProps): JSX.Element => (
    <div {...props}>
        <SvgIcon viewBox="0 0 16 22">
            <defs>
                <path id="a" d="M.3.417h4.892v4.919H.3z" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g transform="rotate(-45 10.7955635 .92798622)">
                    <mask id="b" fill="#fff">
                        <use href="#a" />
                    </mask>
                    <path
                        fill="#FFF"
                        d="M2.026 4.696h3.08L2.05.629C1.965.497 1.818.417 1.66.417H.764c-.333 0-.557.34-.426.645l1.688 3.634z"
                        mask="url(#b)"
                    />
                </g>
                <path
                    fill="#FFF"
                    d="M13.64693643 5.20992597L6.5426346 12.3142278v-.0014142l-2.06263048-.29486354c-.14424978-.0212132-.28991378.02828427-.39244426.13081476l-.59114127.59114127c-.2496087.24960869-.14000714.67457987.1979899.7721606l2.29597572.66397327.66255905 2.2945615c.09899495.33941126.52325902.4483057.77286771.19869701l.59114127-.59114127c.10253049-.10253048.15132085-.24890159.13081476-.39244426l-.29486353-2.06263048 1.86110505-1.86110505 2.02444671 4.89812867c.12232947.30759145.5211377.38961584.75589715.15485639l.63427478-.63427479c.11101577-.11101576.15909903-.2722361.12586501-.42567828l-1.2522861-6.28122954 2.62690168-2.62690169c.688722-.688722.688722-1.27562063.32739044-1.6369522-.36133156-.36133156-.9482302-.36133156-1.30956176 0"
                />
            </g>
        </SvgIcon>
    </div>
);

type CustomIconRendererProps = { price: Price | null; checked: boolean; childCount?: number };

const MarkerIconWrapper = ({
    price,
    className,
    children,
    checked,
    childCount,
}: { children?: ReactNode; className: string } & CustomIconRendererProps): JSX.Element => (
    <div>
        <div className={className}>
            <Checkbox
                // This checkbox doesn't have event handlers as it will be converted to string
                onChange={(): void => void 0}
                checked={checked}
                disabled={false}
                bordered
                showFakeCheckbox
            >
                <div className={`${BASE_CLASS}__content`}>
                    {childCount && (
                        <b>
                            {childCount} {/* There will always be at least 2 stations here */}
                            <FormattedMessage id="LABEL_STATIONS" values={{ count: 2 }} />
                        </b>
                    )}
                    {price && childCount ? <>&nbsp;</> : null}
                    {price && (
                        <p>
                            <FormattedMessage
                                id="LABEL_MINIMALIST_PRICE_FROM"
                                values={{
                                    price: <PriceLabel {...price} alwaysHideDecimals />,
                                }}
                            />
                        </p>
                    )}
                </div>
            </Checkbox>

            {children}
        </div>
        <MarkerBlueArrow />
    </div>
);

type CustomIconRenderer = (props: CustomIconRendererProps) => JSX.Element;

const UnknownMarkerIcon: CustomIconRenderer = ({ ...props }): JSX.Element => (
    <MarkerIconWrapper className={classNames(BASE_CLASS, props.childCount && `${BASE_CLASS}--cluster`)} {...props} />
);

const RailwayMarkerIcon: CustomIconRenderer = ({ ...props }): JSX.Element => (
    <MarkerIconWrapper
        {...props}
        className={classNames(BASE_CLASS, `${BASE_CLASS}--railway`, props.childCount && `${BASE_CLASS}--cluster`)}
    >
        <RailwayIcon className={`${BASE_CLASS}__icon`} />
    </MarkerIconWrapper>
);

const AirportMarkerIcon: CustomIconRenderer = ({ ...props }): JSX.Element => (
    <MarkerIconWrapper
        {...props}
        className={classNames(BASE_CLASS, `${BASE_CLASS}--airport`, props.childCount && `${BASE_CLASS}--cluster`)}
    >
        <AirportIcon className={`${BASE_CLASS}__icon`} />
    </MarkerIconWrapper>
);

const icons: Record<StationType, CustomIconRenderer> = {
    airport: AirportMarkerIcon,
    railway: RailwayMarkerIcon,
    city: UnknownMarkerIcon,
    ferry: UnknownMarkerIcon,
    hotel: UnknownMarkerIcon,
    unknown: UnknownMarkerIcon,
};

const Icon = ({ type, ...props }: CustomIconRendererProps & { readonly type: StationType }): JSX.Element => {
    const IconRenderer = icons[type];
    return <IconRenderer {...props} />;
};

export default Icon;
