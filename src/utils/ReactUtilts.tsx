import React, { useEffect, useState, ReactElement } from 'react';
import { IntlShape, IntlProvider } from 'react-intl';
import { renderToString } from 'react-dom/server';
import { Indexed } from './TypeUtils';

/**
 * This function assists to work around components that don't update properly to new values
 *
 * Just call this function like you at the top of your component with the value that might update
 *
 * It will handle the on/off rendering state.
 */
export const shouldRender: <T extends string | number | boolean | null>(value: T) => boolean = value => {
    const [auxValue, setAuxValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setAuxValue(value), 0);
        return (): void => clearTimeout(timeoutId);
    }, [value]);

    return value === auxValue;
};

type SupportedHandlers = Pick<GlobalEventHandlers, 'onclick' | 'onblur'>;

/**
 * This function is here so typescript does not complain
 */
const setEvent = <T, K extends keyof T>(obj: T, key: K, value: T[K]): void => {
    obj[key] = value;
};

export type ConvertToElementProps = {
    reactElement: ReactElement;

    events?: Indexed<Partial<SupportedHandlers>>;

    /**
     * These dependencies should NOT change from iteration to iteration, React gets cranky
     */
    dependencies: {
        intl?: IntlShape;
    };
};

/**
 * This function converts a react element to an Element
 *
 * Be careful of how dependencies are handled
 */
export const convertToElement = ({
    reactElement,
    events = {},
    dependencies: { intl },
}: ConvertToElementProps): Element => {
    let wrappedInProvider = reactElement;

    if (intl) {
        wrappedInProvider = <IntlProvider {...intl}>{wrappedInProvider}</IntlProvider>;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderToString(wrappedInProvider);

    for (const [querySelector, handlers] of Object.entries(events || {})) {
        const element: HTMLElement | null = wrapper.querySelector(querySelector);
        if (!element) {
            continue;
        }

        for (const eventName of Object.keys(handlers)) {
            const typedEventName = eventName as keyof SupportedHandlers;
            const value = handlers[typedEventName];

            if (value) {
                setEvent(element, typedEventName, value);
            }
        }
    }

    return wrapper.children[0];
};

/**
 * Helper to have easily killable callbacks
 *
 * @param callback
 */
export const createKillable = <R extends unknown>(callback: () => R): [VoidFunction, VoidFunction] => {
    let alive = true;
    return [
        (): void => {
            alive && callback();
        },
        (): void => {
            alive = false;
        },
    ];
};
