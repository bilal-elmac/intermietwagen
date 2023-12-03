import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const IconDoor: React.FC<{}> = (): JSX.Element => {
    return (
        <SvgIcon fontSize="small" viewBox="0 0 16 16">
            <path
                fill="#4F4F4F"
                fillRule="evenodd"
                d="M16 14v2H0v-2h16zm0-14v13H0V6.311L7.55.357C7.846.124 8.19 0 8.543 0H16zm-2.094 9.75h-3c-.276 0-.5.227-.5.508 0 .28.224.508.5.508h3c.276 0 .5-.228.5-.508a.504.504 0 00-.5-.508zm.493-8.125H9.09c-.273 0-.542.097-.772.278L2.445 6.534v1.591h11.954v-6.5z"
            />
        </SvgIcon>
    );
};
