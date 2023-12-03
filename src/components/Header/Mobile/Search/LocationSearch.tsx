import React from 'react';
import SearchComponent from '../../../Search/';
import { SearchComponentProps } from '../../../Search/SearchComponent';

export const LocationSearch: React.FC<SearchComponentProps> = ({ type }) => {
    return (
        <div className="hc-results-view__header-searchbar__mobile-drawer flex flex-col bg-light-blue pb-2 h-screen md:h-auto">
            <div className="dropoff-autocomplete h-16 border-b border-solid border-outline w-full bg-white flex items-center">
                <SearchComponent type={type} />
            </div>
        </div>
    );
};
