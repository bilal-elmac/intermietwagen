import React from 'react';
import { Snackbar } from '@material-ui/core';
import classNames from 'classnames';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Alert, AlertTitle } from '@material-ui/lab';

// in milliseconds
const VISIBLE_TIME = 5000;

interface Props {
    open: boolean;
    title?: string | JSX.Element;
    children: string | JSX.Element;
    className?: string;
    onClose?: () => void;
}

export const Notification: React.FC<Props> = ({ open, onClose, title, children, className }: Props): JSX.Element => (
    <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={onClose}
        className={classNames('hc-notification', className && className)}
        autoHideDuration={VISIBLE_TIME}
    >
        <>
            <Alert
                variant="outlined"
                severity="success"
                icon={<CheckCircleOutlineIcon fontSize="small" />}
                onClose={onClose}
            >
                <AlertTitle>
                    <p className="text-base font-sans flex justify-between">{title}</p>
                </AlertTitle>
                <p className="text-sm font-sans max-w-xs">{children}</p>
            </Alert>
        </>
    </Snackbar>
);
