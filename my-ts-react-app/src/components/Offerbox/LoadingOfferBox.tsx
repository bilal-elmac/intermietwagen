import React from 'react';
import classNames from 'classnames';

import PulseLoader, { Moldure, TransparentPatch, WhitePatch } from '../../ui/PulseLoader';

import { isMobile } from '../../utils/MediaQueryUtils';

const Lines = (): JSX.Element => (
    <>
        <TransparentPatch className="h-4" />
        <WhitePatch className="h-4" />
        <TransparentPatch className="h-4" />
        <WhitePatch className="h-4" />
        <TransparentPatch className="h-4" />
        <WhitePatch className="h-4" />
        <TransparentPatch className="h-4" />
        <WhitePatch className="h-4" />
        <TransparentPatch className="h-4" />
    </>
);

const LeftSideButton = (): JSX.Element => (
    <div className="w-4/12 h-full">
        <WhitePatch className="h-6" />
        <TransparentPatch className="h-10" />
        <WhitePatch className="h-20" />
    </div>
);

const MobileLoadingOfferBox = (): JSX.Element => (
    <>
        <Moldure topBorderSize={10} bottomBorderSize={5} borderSize={6}>
            <div className="flex">
                <TransparentPatch className="w-6/12 h-full" />
                <WhitePatch className="w-2/12" />
                <LeftSideButton />
            </div>
        </Moldure>
        <Moldure topBorderSize={5} bottomBorderSize={10} borderSize={6}>
            <div className="w-12/12 h-full">
                <Lines />
            </div>
        </Moldure>
    </>
);

const DesktopLoadingOfferBox = (): JSX.Element => (
    <Moldure topBorderSize={10} bottomBorderSize={10} borderSize={6}>
        <div className="flex">
            <TransparentPatch className="w-3/12 h-full" />
            <WhitePatch className="w-1/12" />
            <div className="w-4/12 h-full">
                <Lines />
            </div>
            <WhitePatch className="w-4/12" />
            <LeftSideButton />
        </div>
    </Moldure>
);

export const LoadingOfferBox = ({ className }: { className?: string }): JSX.Element => {
    const useMobile = isMobile();
    return (
        <PulseLoader className={classNames('w-full mb-4', className, !useMobile && 'flex')}>
            {useMobile ? <MobileLoadingOfferBox /> : <DesktopLoadingOfferBox />}
        </PulseLoader>
    );
};
