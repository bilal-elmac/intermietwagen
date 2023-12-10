import { DivIconOptions } from 'leaflet';

import { convertToElement, ConvertToElementProps } from '../../../utils/ReactUtilts';

interface CustomIconProps {
    readonly icon: ConvertToElementProps['reactElement'];
    readonly intl: ConvertToElementProps['dependencies']['intl'];
    readonly onInteraction: (type: CustomInteractionType) => void;
}

export type CustomInteractionType = 'checkboxClick' | 'iconClick';

/**
 * Function responsible for creating the marker icons, a bridhe between react and leaftlet icons
 */
export const createDivIconOptions = ({ icon, intl, onInteraction }: CustomIconProps): DivIconOptions => {
    const wrapper = convertToElement({
        reactElement: icon,
        dependencies: { intl },

        events: {
            '.hc-results-view__map__custom-marker': {
                onclick: ({ target }): void => {
                    const checkedIcon = wrapper.querySelector('svg.hc-results-view__checkbox__icon');
                    const clickedOnCheckbox =
                        target === checkedIcon || (checkedIcon && checkedIcon.contains(target as Node));
                    onInteraction(clickedOnCheckbox ? 'checkboxClick' : 'iconClick');
                },
            },
            input: {
                onclick: (e): void => {
                    // Stops click double event firing
                    e.stopPropagation();
                },
            },
        },
    });

    return {
        className: 'hc-results-view__map__leaflet-marker',
        /**
         * Server side rendering seems to be a common workaround
         *
         * But it forces us to render everything without the use of localization
         */
        html: wrapper as HTMLElement,
    };
};
