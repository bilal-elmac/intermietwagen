import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const IconTelephone: React.FC<{}> = (): JSX.Element => {
    return (
        <SvgIcon style={{ fontSize: '1.5rem' }} viewBox="0 0 19 19">
            <path
                fill="#2479D3"
                d="M2.145 2.281c.617-.609 1.392-.609 2.013-.004.383.376.759.76 1.138 1.139.368.372.736.735 1.103 1.107.649.652.649 1.412.004 2.06-.462.466-.92.933-1.391 1.388-.123.122-.135.221-.072.371.313.744.76 1.404 1.262 2.02 1.012 1.242 2.155 2.345 3.519 3.203.292.182.616.317.92.483.155.087.262.059.388-.072.463-.474.933-.94 1.404-1.407.617-.613 1.392-.613 2.012 0 .756.751 1.51 1.502 2.262 2.257.629.633.625 1.408-.008 2.048-.427.431-.882.843-1.285 1.293-.589.66-1.324.874-2.17.827-1.23-.068-2.361-.475-3.452-1.005-2.424-1.178-4.496-2.81-6.231-4.875C2.276 11.588 1.216 9.924.52 8.05.18 7.144-.062 6.215.013 5.23c.047-.604.273-1.122.72-1.545.482-.459.937-.937 1.411-1.404zM9.61 3.796c1.415.197 2.7.838 3.716 1.854.961.965 1.594 2.178 1.823 3.519l-1.459.249c-.178-1.036-.664-1.977-1.407-2.72-.787-.787-1.783-1.281-2.879-1.436zM9.804 0c2.352.328 4.483 1.392 6.168 3.076 1.597 1.601 2.645 3.618 3.028 5.84l-1.459.249c-.328-1.918-1.233-3.661-2.613-5.041-1.455-1.451-3.298-2.373-5.33-2.657z"
            />
        </SvgIcon>
    );
};
