import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const IconAdult = ({ className }: { className?: string }): JSX.Element => (
    <SvgIcon className={className} width="12" height="26" viewBox="0 0 12 26">
        <path
            fillRule="evenodd"
            d="M8 8c2.209 0 4 1.791 4 4v4c0 1.104-.896 2-2 2v-5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v5.002L8 24c0 1.104-.896 2-2 2s-2-.896-2-2l-1-6v-5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v5c-1.104 0-2-.896-2-2v-4c0-2.209 1.791-4 4-4zM6 0c1.657 0 3 1.343 3 3S7.657 6 6 6C4.344 6 3 4.657 3 3s1.344-3 3-3z"
        />
    </SvgIcon>
);
