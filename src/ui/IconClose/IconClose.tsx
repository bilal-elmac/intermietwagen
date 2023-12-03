import React from 'react';
import { SvgIcon } from '@material-ui/core';

interface Props {
    customClassNames?: string;
}

export const IconClose: React.FC<Props> = ({ customClassNames }): JSX.Element => {
    return (
        <SvgIcon fontSize="small" viewBox="0 0 13 13" className={customClassNames}>
            <path
                fill="#4F4F4F"
                d="M6.5 8.045l4.635 4.635c.427.427 1.118.427 1.545 0 .427-.427.427-1.118 0-1.545L8.045 6.5l4.635-4.635c.427-.427.427-1.118 0-1.545-.427-.427-1.118-.427-1.545 0L6.5 4.955 1.865.32C1.438-.107.747-.107.32.32c-.427.427-.427 1.118 0 1.545L4.955 6.5.32 11.135c-.427.427-.427 1.118 0 1.545.427.427 1.118.427 1.545 0L6.5 8.045z"
            />
        </SvgIcon>
    );
};
