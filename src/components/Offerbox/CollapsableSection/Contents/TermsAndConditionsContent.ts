import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import parse from 'html-react-parser';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { DomElement } from 'domhandler';
import classNames from 'classnames';

import { isRVError } from '../../../../domain/Error';

import { useReduxDispatch, useReduxState } from '../../../../reducers/Actions';
import { loadTermsAction } from '../../../../reducers/TermsActions';
import { useServices } from '../../../../state/Services.context';

import { boldFormatter } from '../../../../utils/FormatterUtils';
import { simplify, highlight } from '../../../../utils/StringUtils';

import Input from '../../../../ui/Input';
import Button from '../../../../ui/Button';
import IconSearch from '../../../../ui/IconSearch';
import IconTelephone from '../../../../ui/IconTelephone';

import { TabProps } from '../Panel';

interface BaseProps {
    readonly customClassNames?: string;
}

const HotlineContainer = ({ customClassNames }: BaseProps): JSX.Element => (
    <div className={`${customClassNames}__hotline-container`}>
        <IconTelephone />
        <span className="ml-2 text-base font-bold">
            <FormattedMessage id="LABEL_LOCAL_HOTLINE" />
        </span>
        <p className="text-base mt-2">
            <FormattedMessage id="LOCAL_HOTLINE" />
        </p>
        <small>
            <FormattedMessage id="LOCAL_HOTLINE_ADDITIONAL_INFORMATION" values={{ strong: boldFormatter }} />
        </small>
    </div>
);

const Loader = ({ customClassNames }: BaseProps): JSX.Element => (
    <div className={classNames(`${customClassNames}__loader`, 'py-4 text-center')}>
        <CircularProgress />
    </div>
);

const Error = (): JSX.Element => (
    <Alert variant="filled" severity="error">
        <FormattedMessage id="TERMS_AND_CONDITIONS_ERROR_ALERT" />
    </Alert>
);

const QuickSearchButton = ({
    customClassNames,
    term,
    onClick,
}: BaseProps & { term: string; onClick: () => void }): JSX.Element => (
    <Button
        id={`${customClassNames}__search-container__popular-search-container__popular-search-button`}
        name="popular-search-button"
        className={`${customClassNames}__search-container__popular-search-container__popular-search-button`}
        onClick={onClick}
    >
        <span className="text-dark-grey text-xs font-normal">
            {term}
            <IconSearch
                customClassNames={`${customClassNames}__search-container__popular-search-container__popular-search-icon`}
            />
        </span>
    </Button>
);

interface SearchContainerProps extends BaseProps {
    readonly quickSearch: string[];
    readonly onChange: (value: string) => void;
    readonly onMoveNext: () => void;
}

const SearchContainer = ({
    customClassNames,
    onChange,
    onMoveNext,
    quickSearch,
}: SearchContainerProps): JSX.Element => {
    const intl = useIntl();
    const [searchTerm, setSearchTerm] = useState('');
    const { analyticsService } = useServices();

    useEffect(() => {
        onChange(searchTerm);
        const typingTimer = setTimeout(
            () => searchTerm !== '' && analyticsService.onTermsAndConditionsSearchTerm(searchTerm, true),
            1000,
        );
        return (): void => clearTimeout(typingTimer);
    }, [searchTerm]);

    return (
        <div className={`${customClassNames}__search-container`}>
            <Input
                type="text"
                name={`${customClassNames}__search-container__search-input`}
                customWrapperClassNames={`${customClassNames}__search-container__wrapper-search-input`}
                customClassNames={`${customClassNames}__search-container__search-input`}
                placeholder={intl.formatMessage({ id: 'TERMS_AND_CONDITIONS_SEARCH' })}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                    if (e.key === 'Enter') {
                        onMoveNext();
                    }
                }}
            />
            <Button
                id={`${customClassNames}__search-container__search-button`}
                name="terms-and-conditions-button"
                className={`${customClassNames}__search-container__search-button`}
                onClick={(): void => onMoveNext()}
            >
                <IconSearch />
            </Button>
            {quickSearch.length > 0 && (
                <div className={`${customClassNames}__search-container__popular-search-container`}>
                    <p className="text-sm text-blue font-bold my-auto">
                        <FormattedMessage id="TERMS_AND_CONDITIONS_POPULAR_SEARCHES" />
                    </p>
                    {quickSearch.map((quickTerm, k) => (
                        <QuickSearchButton
                            key={k}
                            customClassNames={customClassNames}
                            term={quickTerm}
                            onClick={(): void => {
                                setSearchTerm(quickTerm);
                                analyticsService.onTermsAndConditionsSearchTerm(quickTerm, false);
                                if (quickTerm === searchTerm) {
                                    onMoveNext();
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const hasValidText = (node: DomElement): boolean => Boolean(node.type === 'text' && node.data && node.data.trim());

/**
 * Iterates through a dom node
 *
 * @param node Starting point
 * @param nextNode Gets the next node
 * @param evaluator Evaluate if current node is valid
 * @param path previous path
 */
const traverse = (
    node: DomElement,
    nextNode: (n: DomElement) => DomElement | undefined,
    evaluator: (n: DomElement) => boolean,
    path: DomElement[] = [],
): DomElement[] => {
    if (evaluator(node)) {
        path.push(node);
    } else {
        return [];
    }

    const sibling = nextNode(node);
    return sibling ? [...path, ...traverse(sibling, nextNode, evaluator)] : path;
};

const IGNORE_TAGS = new Set(['meta']);

const termsContentReplacer = (node: DomElement, search: string): JSX.Element | null | false | void => {
    if (!hasValidText(node)) {
        if (node.type === 'text' || (node.name && IGNORE_TAGS.has(node.name)) || node.children?.length === 0) {
            // Empty text
            return <></>;
        }

        return false;
    }

    /**
     * Sibling checking is here to enable search of malformed html components
     * Even if the text is broken into multiple text nodes
     */

    // Ignore if previous sibling nodes printed this information
    if (node.prev && traverse(node.prev, n => n.prev, hasValidText).length) {
        return <></>;
    }

    // Print all next sibling nodes info
    const trimmed = traverse(node, n => n.next, hasValidText)
        .map(n => String(n.data).trim())
        .reduce<string[]>((reduced, n) => (n ? [...reduced, n] : reduced), [])
        .join(' ');

    // Finally retrieved the highlighted
    const highlighted = trimmed ? highlight(trimmed, search) : [];

    return (
        <>
            {highlighted.map(([text, isHighlighted], k) => (
                <React.Fragment key={k}>
                    {isHighlighted ? <span className="highlighted-match">{text}</span> : text}
                </React.Fragment>
            ))}
        </>
    );
};

const TermsContent = ({
    search,
    position,
    customClassNames,
    content,
    rateId,
}: BaseProps & { content: string; search: string; position: number; rateId: string }): JSX.Element => {
    const { analyticsService } = useServices();
    return (
        <div
            className={`${customClassNames}__terms-content`}
            ref={(el): void => {
                if (!el) {
                    return;
                }

                // Clear previous selection
                el.querySelectorAll('.selected-match').forEach(el => el.classList.remove('selected-match'));

                // Find new selection
                const highlighted = el.querySelectorAll('.highlighted-match');
                const selected = highlighted[position % highlighted.length];
                if (!selected) {
                    // This scenario happens when there are no highlighted elements
                    return;
                }

                // Select and scroll
                selected.classList.add('selected-match');
                el.scrollTo(0, (selected as HTMLElement).offsetTop - el.offsetTop);
            }}
            onScroll={({ currentTarget: el }: React.UIEvent<HTMLDivElement>): void => {
                const isScrolledToBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
                analyticsService.onTermsAndConditionsScroll(isScrolledToBottom, rateId);
            }}
        >
            {parse(content, { replace: node => termsContentReplacer(node, search) })}
        </div>
    );
};

const isMatch = (content: string, searchTerm: string): boolean =>
    Boolean(content && searchTerm) && simplify(content).includes(simplify(searchTerm));

interface Props extends BaseProps {
    readonly rateId: string;
}

export const QUICK_SEARCH_LIMIT = 5;

const TermsAndConditionsContent: React.FC<Props & TabProps> = ({ customClassNames, tabLabel, rateId }) => {
    const { formatMessage } = useIntl();
    const dispatch = useReduxDispatch();
    const { analyticsService } = useServices();

    /**
     * Configuration
     */
    const termsContent = useReduxState(state => state.terms[rateId] || null);
    const hasHotline = useReduxState(state => state.staticConfiguration.hasHotline);
    const quickSearch =
        termsContent && !isRVError(termsContent)
            ? formatMessage({ id: 'TERMS_AND_CONDITIONS_QUICK_SEARCHES' })
                  .split('|')
                  .filter(t => isMatch(termsContent, t))
                  .slice(0, QUICK_SEARCH_LIMIT)
            : [];

    /**
     * State
     */
    const [{ search, position }, setSearch] = useState({ search: '', position: 0 });

    /**
     * Delayed load
     */
    useEffect(() => {
        if (termsContent === null) {
            dispatch(loadTermsAction(rateId));
        }
    }, [termsContent]);

    return (
        <div className={customClassNames}>
            <h2 className="text-xl font-bold mb-4">
                <FormattedMessage id={tabLabel} />
            </h2>

            {hasHotline && <HotlineContainer customClassNames={customClassNames} />}
            {termsContent !== null && !isRVError(termsContent) && (
                <SearchContainer
                    customClassNames={customClassNames}
                    onChange={(search): void => setSearch({ search, position: 0 })}
                    onMoveNext={(): void => {
                        setSearch({ search, position: position + 1 });
                        analyticsService.onTermsAndConditionsSearchCycle(search);
                    }}
                    quickSearch={quickSearch}
                />
            )}
            {termsContent === null && <Loader customClassNames={customClassNames} />}
            {termsContent !== null && isRVError(termsContent) && <Error />}
            {termsContent !== null && !isRVError(termsContent) && (
                <TermsContent
                    customClassNames={customClassNames}
                    content={termsContent}
                    search={search}
                    position={position}
                    rateId={rateId}
                />
            )}
        </div>
    );
};

export default TermsAndConditionsContent;
