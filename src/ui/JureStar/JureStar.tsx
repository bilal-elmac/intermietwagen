import React from 'react';
import { SvgIcon } from '@material-ui/core';
import { injectIntl } from 'react-intl';

export const JureStar = injectIntl(
    ({ intl: { formatMessage } }): JSX.Element => (
        <SvgIcon width="62" height="59" viewBox="0 0 62 59" className="hc-results-view__star">
            <g fill="none" fillRule="evenodd">
                <path
                    fill="#FBD263"
                    fillRule="nonzero"
                    stroke="#EFC75C"
                    strokeWidth="1.5"
                    d="M59.903 21.248c-.23-.694-.839-1.203-1.575-1.319l-18.17-2.853-8.39-16.019C31.429.408 30.747 0 30 0c-.745 0-1.428.408-1.769 1.057l-8.389 16.02-18.17 2.853c-.736.115-1.344.625-1.575 1.318-.23.694-.044 1.455.482 1.972l12.985 12.754-2.84 17.782c-.115.721.192 1.444.795 1.873.603.428 1.402.49 2.067.161L30 47.653l16.415 8.137c.283.14.591.21.898.21.412 0 .822-.125 1.168-.371.603-.429.91-1.152.795-1.873l-2.84-17.782L59.422 23.22c.526-.517.712-1.278.482-1.972z"
                    transform="translate(1 1.162)"
                />
                <text
                    fill="#FFF"
                    fontFamily="OpenSans-Bold, Open Sans"
                    fontSize="14"
                    fontWeight="bold"
                    letterSpacing="-.3"
                    transform="translate(1 1.162)"
                >
                    <tspan x="16" y="36">
                        {formatMessage({ id: 'LABEL_NEW' }).toUpperCase()}
                    </tspan>
                </text>
            </g>
        </SvgIcon>
    ),
);
