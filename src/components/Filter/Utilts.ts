import { hasOffers as selectHasOffers } from '../../domain/AppState';
import { FilterOption } from '../../domain/Filter';
import { useReduxState } from '../../reducers/Actions';

export const useOverrideDisabled: () => (o: FilterOption<unknown>) => boolean = () => {
    const hasOffers = useReduxState(selectHasOffers);
    return (option): boolean => {
        /**
         * Has no offers, so it should be always disabled
         */
        if (!hasOffers) {
            /**
             * Unless it was selected, as to allow the user to de-select it
             */
            if (option.selected) {
                return false;
            }

            return true;
        }

        return option.disabled;
    };
};
