export class Throttler {
    private readonly timeout: number;
    private timeoutId: number | null;

    constructor(timeout: number) {
        this.timeout = timeout;
        this.timeoutId = null;
    }

    run(callback: () => unknown): void {
        this.timeoutId && window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(callback, this.timeout);
    }
}

/**
 * This function is here to workaround the issue of React no integrating properly with other rendering frameworks
 *
 * The idea is that, even if there is still a reference to the result of this function, it will be prevent to be used until a certain amount of time
 */
export const preventUntil = <V, T extends Array<V>>(
    callback: (...args: T) => void,
    timeout: number,
): typeof callback => {
    const start = Date.now();
    const time = start + timeout;

    return (...args: T): void => {
        if (time < Date.now()) {
            callback(...args);
        }
    };
};
