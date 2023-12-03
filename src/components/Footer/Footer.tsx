import React from 'react';

import { useReduxState } from '../../reducers/Actions';

import { Logo } from '../../ui/Logo';
import { HomePageURL } from '../HomePageUrl';

import './Footer.css';

export const Footer: React.FC<{}> = () => {
    const platform = useReduxState(state => state.staticConfiguration.platform);

    return (
        <footer className="hc-results-view__footer">
            <div className="hc-results-view__footer-logo">
                <HomePageURL>
                    <Logo width="md" platform={platform} />
                </HomePageURL>
            </div>
        </footer>
    );
};
