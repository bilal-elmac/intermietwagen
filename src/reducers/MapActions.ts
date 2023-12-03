import { ActionType, DispatchAction } from './Actions';

export const openMap = (isMapOpen: boolean): DispatchAction => ({
    type: ActionType.MapToggled,
    payload: { isMapOpen, loadMapData: isMapOpen },
});
