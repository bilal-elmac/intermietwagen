import React from 'react';

import { SvgIcon, SvgIconProps } from '@material-ui/core';

const CalendarIcon = (props: SvgIconProps): JSX.Element => (
    <SvgIcon className="hc-results-view__static-calendar" {...props}>
        <path d="M12.183 0c.528 0 .962.39 1.017.89l.006.11v1.337H18v17.6H0v-17.6h4.615V1c0-.552.458-1 1.023-1 .528 0 .961.39 1.017.89L6.66 1v1.337h4.5V1c0-.552.457-1 1.022-1zm2.749 14.937h-2.046v2h2.046v-2zm-4.91 0H7.978v2h2.046v-2zm-4.909 0H3.068v2h2.045v-2zm9.819-4.8h-2.046v2h2.046v-2zm-4.91 0H7.978v2h2.046v-2zm-4.909 0H3.068v2h2.045v-2zm-.498-6.2H1.636v3.2h14.727v-3.2h-3.157v.83c0 .552-.457 1-1.023 1-.527 0-.96-.39-1.016-.892l-.006-.109v-.83h-4.5v.83c0 .553-.458 1-1.023 1-.528 0-.961-.39-1.017-.89l-.006-.11v-.83z" />
    </SvgIcon>
);

export default CalendarIcon;
