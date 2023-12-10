import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const IconBag: React.FC<{}> = (): JSX.Element => {
    return (
        <SvgIcon fontSize="small" viewBox="0 0 18 15">
            <path
                fill="#4F4F4F"
                fillRule="evenodd"
                d="M15.883 4.235v10.589h-1.345V4.235H3.461v10.589H2.123V4.235H.692c-.382 0-.692.34-.692.757v9.075c0 .418.31.757.692.757h16.616c.382 0 .692-.339.692-.757V4.992c0-.418-.31-.757-.692-.757h-1.425zM11.645 3.004H10.27v-1.12c0-.188-.142-.34-.317-.34h-2.01c-.175 0-.317.152-.317.34v1.12H6.248v-1.12c0-1.005.76-1.823 1.694-1.823h2.01c.934 0 1.693.818 1.693 1.823v1.12zM4.055 3.004H2.11c-.38 0-.688-.33-.688-.74s.308-.742.688-.742h1.945c.38 0 .688.331.688.741s-.308.741-.688.741M15.784 3.004H13.84c-.38 0-.688-.33-.688-.74s.307-.742.688-.742h1.944c.38 0 .688.331.688.741s-.308.741-.688.741"
            />
        </SvgIcon>
    );
};