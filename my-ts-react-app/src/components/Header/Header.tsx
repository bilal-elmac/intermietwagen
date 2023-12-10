import React from 'react';

import { DateProvider } from '../../state/DatePicker.context';

import { Logo } from '../../ui/Logo';
import HelpComponent from '../HelpComponent';

import { DesktopNavigation } from './Desktop/Navigation';
import { MobileNavigation } from './Mobile/Navigation';
import { HomePageURL } from '../HomePageUrl';

import { isTabletOrSmaller } from '../../utils/MediaQueryUtils';

export const Header: React.FC<{}> = () => {
    const isMobileDevice = isTabletOrSmaller();

    return (
        <DateProvider>
            <div className="hc-results-view__header">
                <header className="bg-light-blue lg:w-screen">
                    <div className="container">
                        <div className="hc-results-view__header-wrapper relative flex md:items-center flex-wrap lg:-mx-5 border-b border-solid border-outline lg:border-none">
                            {isMobileDevice ? (
                                <nav className="w-full">
                                    <MobileNavigation />
                                </nav>
                            ) : (
                                <>
                                    <div className="hc-results-view__header-logo-wrapper self-center w-3/5 md:w-1/4 lg:my-5 lg:pr-8 lg:pl-5 lg:w-1/4">
                                        <div className="hc-results-view__header-logo">
                                            <HomePageURL>
                                                <Logo width="sm" />
                                            </HomePageURL>
                                        </div>
                                    </div>
                                    <div className="hc-results-view__header-meta flex-col h-full w-full md:w-3/4 lg:pr-5 lg:w-3/4">
                                        <nav className="w-full">
                                            <DesktopNavigation />
                                        </nav>
                                    </div>
                                    <div className="hc-results-view__header-meta-nav--right absolute w-full lg:w-1/4 top-0 right-5 flex items-end">
                                        <HelpComponent />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>
            </div>
        </DateProvider>
    );
};
