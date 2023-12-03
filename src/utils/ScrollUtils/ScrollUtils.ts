type CallbackOptions = {
    readonly callback?: VoidFunction;
};

/**
 * vertical - to scroll to have the element in the *center* of the screen
 * toElm - scroll to the element top and deduct the height of the fixed header
 * horizontal - scroll horizontally
 */
type ScrollType = 'vertical' | 'horizontal' | 'toElm';
type ParametersOrCallback = VoidFunction | Partial<ScrollIntoViewOptions & CallbackOptions> | ScrollToOptions | number;
type ScrollElement = HTMLElement | null;

const DEFAULT_OPTIONS: ScrollIntoViewOptions & CallbackOptions = {
    block: 'center',
    behavior: 'smooth',
};

// TODO ENG-2704 Deal with techinical debt
const onScrollStop = (callback: VoidFunction): void => {
    // Setup scrolling variable
    let isScrolling: number;

    const listener: VoidFunction = () => {
        // Clear our timeout throughout the scroll
        if (isScrolling) {
            window.clearTimeout(isScrolling);
        }

        // Set a timeout to run after scrolling ends
        isScrolling = window.setTimeout(() => {
            // Remove listener
            window.removeEventListener('scroll', listener);

            // Finally call
            callback();
        }, 50);
    };

    // Listen for scroll events
    window.addEventListener('scroll', listener);
};

const scrollFallback = (scrollAction: () => void, position: number): void => {
    // avoid weird smooth scrolling for FF
    if ('scrollBehavior' in document.documentElement.style && !navigator.userAgent.includes('Firefox')) {
        scrollAction();
    } else {
        window.scrollTo(0, position);
    }
};

/**
 * @deprecated This function needs to be revised into simpler more/readable flows
 *
 * @param { HTMLElement } element - element to scroll to
 * @param { ScrollType } type - type of scrolling
 * @param { ParametersOrCallback } params - scrolling params or callback to run with scrolling or position for horizontal scrolling
 */
export function scrollTo(type: 'vertical' | 'toElm', element: ScrollElement, params?: ParametersOrCallback): boolean;
export function scrollTo(type: 'horizontal', element: ScrollElement, position: ScrollToOptions | number): boolean;
export function scrollTo(type: ScrollType, element: ScrollElement, params?: ParametersOrCallback): boolean {
    if (!element) {
        return false;
    }

    const parameters =
        typeof params === 'function'
            ? { callback: params }
            : typeof params === 'number'
            ? { position: params }
            : params;
    const { callback, position, ...scrollOptions } = { ...DEFAULT_OPTIONS, ...parameters };
    const singleCard = element.scrollWidth / element.children.length;

    callback && onScrollStop(callback);

    switch (type) {
        case 'toElm': {
            // deduct header height to get correct scroll position
            const headerHeight = document.querySelector('.hc-results-view__header')?.clientHeight || 0;
            const scrollPos = element.offsetTop - headerHeight;
            scrollFallback(() => window.scrollTo({ ...scrollOptions, top: scrollPos }), scrollPos);
            break;
        }
        case 'vertical': {
            scrollFallback(() => element.scrollIntoView(scrollOptions), element.offsetTop);
            break;
        }
        case 'horizontal': {
            if (typeof position === 'number') {
                const horizontalOptions: ScrollIntoViewOptions = {
                    ...scrollOptions,
                    inline: position > 0 ? 'center' : 'start',
                    block: 'nearest',
                };
                // scrooll to item, if no item - to start
                if ('scrollBehavior' in document.documentElement.style) {
                    element.children[Math.max(0, position)].scrollIntoView(horizontalOptions);
                } else {
                    element.scrollLeft = position * singleCard;
                }
            }

            if (element.scrollTo) {
                element.scrollTo(scrollOptions);
            } else {
                if ('left' in scrollOptions && scrollOptions.left) {
                    element.scrollLeft = scrollOptions.left;
                } else {
                    return false;
                }
            }

            break;
        }
        default:
            break;
    }

    return true;
}

export const scrollToTop = (parametersOrCallback?: Omit<ParametersOrCallback, 'number'>): boolean =>
    scrollTo('toElm', document.body, parametersOrCallback);

export const onScroll = (callback: (isScrolling: boolean) => void): void => {
    window.addEventListener('scroll', () => {
        callback(true);
        onScrollStop(() => callback(false));
    });
};
