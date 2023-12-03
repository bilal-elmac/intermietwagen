import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { isMobile, isTablet } from '../../utils/MediaQueryUtils';

const getModalRoot = (): HTMLElement => document.getElementById('modal-root') as HTMLElement;

export const ModalPortal = ({ children }: { children?: React.ReactNode }): JSX.Element => {
    const mobile = isMobile();
    const tablet = isTablet();

    const modalRoot = getModalRoot();
    const el = document.createElement('div');

    useEffect(() => {
        modalRoot.appendChild(el);
        return (): void => {
            modalRoot.removeChild(el);
        };
    }, [mobile, tablet]);

    return ReactDOM.createPortal(children, el);
};
