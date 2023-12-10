import { remove as removeDiacritics, diacriticsMap } from 'diacritics';

import { Indexed } from '../TypeUtils';

const simplifyCache: Indexed<string> = {};

/**
 * Change the string to lower case and remove spaces and ampersands,
 * e.g. "Cars & Camper" => carscamper
 * @param name {string} string to change
 */
export const unifyProperName = (name: string): string => name.replace(/(\s+|&)/g, '').toLowerCase();

/**
 * Removes diacritics and uppercase from the given chars
 */
export const simplify = (str: string): string => {
    const out = simplifyCache[str];

    if (out) {
        return out;
    }

    simplifyCache[str] = (str.length > 1 ? Array.from(str) : [str])
        .map(c => removeDiacritics(diacriticsMap[c] || c).toLowerCase())
        .join('');

    return simplifyCache[str];
};

/**
 * Helper to handle diacritics while finding search matches
 */
class DiacriticsString {
    private readonly originalChars: string[];
    private readonly diacriticChars: string[];

    constructor(original: string[]) {
        this.originalChars = original;
        this.diacriticChars = original.map(c => simplify(c));
    }

    private findMatchStartIndex(simpliefiedSearch: string, end: number): number {
        let buffer = '';

        let i = end - 1;

        while (i >= 0) {
            /**
             * Remove first item
             */
            buffer = this.diacriticChars[i] + buffer;

            if (buffer.includes(simpliefiedSearch)) {
                return i;
            }

            i--;
        }

        return i;
    }

    private findMatchEndIndex(simpliefiedSearch: string): number | null {
        let buffer = '';

        let i = 0;

        while (i < this.originalChars.length) {
            /**
             * Remove first item
             */
            buffer += this.diacriticChars[i];
            i++;

            if (buffer.includes(simpliefiedSearch)) {
                return i;
            }
        }

        return null;
    }

    splitFirst(diacriticsSearchChars: string): [string[]] | [string[], string[], string[]] {
        const end = this.findMatchEndIndex(diacriticsSearchChars);

        if (end === null) {
            /**
             * No match found
             */
            return [this.originalChars];
        }

        const start = this.findMatchStartIndex(diacriticsSearchChars, end);

        return [
            this.originalChars.slice(0, start),
            this.originalChars.slice(start, end),
            this.originalChars.slice(end),
        ];
    }
}

type HighlightedTupple = [string, boolean];

/**
 * Small helper to build highlight
 *
 * Handles collapsing tupples with same highlight
 */
class HighlightedTupples {
    private out: HighlightedTupple[] = [];

    add(text: string[], highlighted: boolean): this {
        const value = text.join('');
        if (!value) {
            return this;
        }

        const lastPos = this.out.length - 1;

        const last = this.out[lastPos];
        if (last && last[1] === highlighted) {
            this.out[lastPos][0] += value;
        } else {
            this.out.push([value, highlighted]);
        }

        return this;
    }

    toArray(): HighlightedTupple[] {
        return this.out;
    }
}

/**
 * This function outputs an array of highlighted tupples according to the given search terms.
 * It supports diacritics/lowercase/uppercase matching
 *
 * @param text
 * @param search
 */
export const highlight = (text: string, search: string): HighlightedTupple[] => {
    if (!search || !text || search === text) {
        /**
         * No need to highlight anything
         */
        return [[text, search === text]];
    }

    const tupples = new HighlightedTupples();
    const simpliedSearch = simplify(search);
    let textChars = Array.from(text);

    let match: string[][];

    /**
     * While there is something to split
     */
    while ((match = new DiacriticsString(textChars).splitFirst(simpliedSearch)).length === 3) {
        /**
         * Add to tupples
         */
        const [before, highlight, after] = match;
        tupples.add(before, false).add(highlight, true);
        textChars = after;
    }

    tupples.add(match[0], false);

    return tupples.toArray();
};
