import React, { useState, useEffect } from 'react';

const Delayed = ({
    timeout,
    contentKey,
    children,
}: {
    timeout: number;
    contentKey: string | number | boolean;
    children: React.ReactNode;
}): JSX.Element => {
    const [currentChildren, setContent] = useState(children);

    // Update renderization only if there is change according to contentKey
    useEffect(() => {
        const timeoutId = setTimeout(() => setContent(children), timeout);
        return (): void => clearTimeout(timeoutId);
    }, [contentKey]);

    return <>{currentChildren}</>;
};

export default Delayed;
