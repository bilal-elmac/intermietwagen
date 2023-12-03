import React, { useEffect, useState, RefObject, useMemo, createRef } from 'react';
import { onScroll } from '../utils/ScrollUtils';

export enum ScrollMarks {
    FIRST_OFFER = 'FIRST_OFFER',
    CAR_TYPE_QUICK_FILTER = 'CAR_TYPE_QUICK_FILTER',
}

// if should focus = true, window should scroll to elm once the elm rendered
export interface ScrollCustomRef<T> extends RefObject<T> {
    shouldFocus: boolean;
}
type ScrollingProviderProps = { readonly children: React.ReactNode };
export type ScrollMarkRefs = Map<ScrollMarks, ScrollCustomRef<HTMLElement>>;

const ScrollingContext = React.createContext<boolean | undefined>(undefined);
const ScrollMarkRefsContext = React.createContext<ScrollMarkRefs | undefined>(undefined);

const ScrollingProvider = ({ children }: ScrollingProviderProps): JSX.Element => {
    const [isScrolling, setScrolling] = useState<boolean>(false);
    const ScrollMarkRefs = useMemo(() => new Map<ScrollMarks, ScrollCustomRef<HTMLElement>>(), []);

    /**
     * This should run only once
     */
    useEffect(() => {
        /**
         * This ScrollingProvider might be dropped mid way through the multiple callbacks,
         * this ensures that React doesn't crash/complain
         */
        let die = false;
        setTimeout(() => onScroll(scrolling => !die && setScrolling(scrolling)), 500);
        return (): void => {
            die = true;
        };
    }, []);

    return (
        <ScrollingContext.Provider value={isScrolling}>
            <ScrollMarkRefsContext.Provider value={ScrollMarkRefs}>{children}</ScrollMarkRefsContext.Provider>
        </ScrollingContext.Provider>
    );
};

const isScrolling = (): boolean => {
    const context = React.useContext(ScrollingContext);
    if (context === undefined) {
        throw new Error('isScrolling must be used within a ScrollingProvider');
    }
    return context;
};

export const getScrollMarkRefsContext = (): ScrollMarkRefs => {
    const context = React.useContext(ScrollMarkRefsContext);
    if (context === undefined) {
        throw new Error('ScrollMarkRefsContext must be used within a ScrollingProvider');
    }
    return context;
};

/**
 * Creates a ref for the scrolling marker to assign it to the "ref" prop of the component
 * and registers it in ScrollMarkRefsContext
 *
 * @param {ScrollMarks} name Scroll mark identifier
 */
export const registerScrollPoint = <T extends HTMLElement>(name: ScrollMarks): ScrollCustomRef<T> => {
    const refs = getScrollMarkRefsContext();
    const ref = refs.get(name) || { ...createRef<T>(), shouldFocus: false };
    refs.set(name, ref);
    return ref as ScrollCustomRef<T>;
};

/**
 * Updates ref for the scrolling marker.
 * If set to true for the component, it might be set up to scroll once rendered
 *
 * @param {ScrollMarks} name Scroll mark identifier
 */
export const useScrollPointFocus = <T extends HTMLElement>(
    name: ScrollMarks,
): (<T extends HTMLElement>(shouldFocus: boolean) => ScrollCustomRef<T> | null) => {
    const refs = getScrollMarkRefsContext();
    const ref = refs.get(name) || { ...createRef<T>(), shouldFocus: false };
    return <T extends HTMLElement>(shouldFocus: boolean): ScrollCustomRef<T> | null => {
        refs.set(name, { ...ref, shouldFocus });
        return ref as ScrollCustomRef<T>;
    };
};

/**
 * Get method to get existing scrolling markers
 */
export const useScrollPoints = (): ((name: ScrollMarks) => ScrollCustomRef<HTMLElement> | null) => {
    const refs = getScrollMarkRefsContext();
    return (name: ScrollMarks): ScrollCustomRef<HTMLElement> | null => refs.get(name) || null;
};

export { ScrollingProvider, isScrolling };
