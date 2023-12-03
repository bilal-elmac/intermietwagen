import { FilterOption } from '../../domain/Filter';

type SortTupple<O> = [string, FilterOption<O>];
type Sorter<O> = (a: SortTupple<O>, b: SortTupple<O>) => number;

const defaultSorter: Sorter<unknown> = ([a], [b]) => (a > b ? 1 : -1);

export const sortByLabel = <O extends unknown>(
    options: FilterOption<O>[],
    labelRenderer: (o: FilterOption<O>) => string,
    customSorter: Sorter<O> | undefined,
): SortTupple<O>[] =>
    options.map(option => [labelRenderer(option), option] as SortTupple<O>).sort(customSorter || defaultSorter);

export interface OptionsList<O> {
    readonly description?: string;
    readonly options: FilterOption<O>[];
    readonly hasIcons?: boolean;
    readonly isHorizontal?: boolean;

    readonly renderIcon?: (option: FilterOption<O>) => JSX.Element | null;
    readonly renderLabel: (option: FilterOption<O>) => string;
    readonly onChange: (option: FilterOption<O>) => void;
    readonly onReset?: () => void;
    readonly overrideDisabled?: (option: FilterOption<O>) => boolean;
    readonly sort?: Sorter<O>;
}

export interface BaseProps<O> {
    readonly options: OptionsList<O>[];
}
