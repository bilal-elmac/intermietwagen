import React, { useState } from 'react';

import { OneSizedArray } from '../utils/TypeUtils';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'title'> & {
    src: OneSizedArray<string>;
    alt?: string[] | undefined;
    title?: string[] | undefined;
};

const MultiSourcedImage = ({ src, alt, title, onError, ...props }: Props): JSX.Element => {
    const [position, setPosition] = useState(0);
    const actualPosition = position % src.length;

    return (
        <img
            src={src[actualPosition]}
            alt={alt && alt[actualPosition]}
            title={title && title[actualPosition]}
            onError={(e): void => {
                setPosition(position + 1);
                onError && onError(e);
            }}
            {...props}
        />
    );
};

export default MultiSourcedImage;
