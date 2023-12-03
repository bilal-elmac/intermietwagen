import { Indexed } from '../../utils/TypeUtils';

type Evaluator<T> = (response: T) => boolean;

export class Cached<T> {
    private previousResponses: Indexed<Promise<T>> = {};
    private storingStrategy: Evaluator<T>;

    constructor(storingStrategy: Evaluator<T> = (): boolean => true) {
        this.storingStrategy = storingStrategy;
    }

    async fetchOnce(key: string, fetcher: () => Promise<T>): Promise<T> {
        /**
         * Makes sure we store it as early as possible
         */
        this.previousResponses[key] = key in this.previousResponses ? this.previousResponses[key] : fetcher();

        /**
         * Decide if the response can be kept
         */
        let shouldKeep = false;
        try {
            const response = await this.previousResponses[key];
            shouldKeep = this.storingStrategy(response);
            return response;
        } catch (e) {
            shouldKeep = false;
            throw e;
        } finally {
            if (!shouldKeep) {
                delete this.previousResponses[key];
            }
        }
    }
}
