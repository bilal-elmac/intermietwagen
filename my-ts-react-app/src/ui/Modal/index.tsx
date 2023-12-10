import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Backdrop } from '@material-ui/core';

import { useModalDisplayDispatch, isModalShowing, ModalProvider } from './Modal.context';

import { ModalPortal } from './Modal';

export interface ModalProps {
    readonly headline?: string | JSX.Element;
    readonly children: React.ReactNode;
    readonly overlayClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    readonly style?: React.CSSProperties;
    readonly closeOnOverlayClick?: boolean;
    readonly noContentMargin?: boolean;
    readonly className?: string;
}

const Modal: React.FC<ModalProps> = ({
    headline,
    children,
    overlayClick,
    style,
    closeOnOverlayClick = true,
    noContentMargin = false,
    className,
}) => {
    const setModalVisibility = useModalDisplayDispatch();

    useEffect(() => {
        setModalVisibility(true);
        return (): void => setModalVisibility(false);
    }, []);

    return (
        <Backdrop className="hc-modal__overlay" onClick={closeOnOverlayClick ? overlayClick : undefined} open>
            <ModalPortal>
                <div className="hc-modal__body font-sans" style={style}>
                    {headline && <div className="hc-modal__headline">{headline}</div>}
                    <div className={classNames('hc-modal__content', noContentMargin && 'm-0', className && className)}>
                        {children}
                    </div>
                </div>
            </ModalPortal>
        </Backdrop>
    );
};

export { ModalProvider, isModalShowing, useModalDisplayDispatch, Modal as default };
