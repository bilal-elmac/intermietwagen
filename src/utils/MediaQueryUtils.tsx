import { useMediaQuery } from 'react-responsive';

export const isTabletOrSmaller = (): boolean => useMediaQuery({ maxWidth: 1279 });
export const isMobile = (): boolean => useMediaQuery({ maxWidth: 767 });
export const isTablet = (): boolean => useMediaQuery({ minWidth: 768, maxWidth: 1279 });
export const isPortrait = (): boolean => useMediaQuery({ orientation: 'portrait' });
