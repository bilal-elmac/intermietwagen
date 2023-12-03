import React, { ReactNode } from 'react';
import classNames from 'classnames';

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type Renderer = (props: DivProps) => JSX.Element;

const CustomDiv = ({ defaultClassName, className, ...props }: DivProps & { defaultClassName: string }): JSX.Element => (
    <div {...props} className={classNames(defaultClassName, className)} />
);

export const BASE_CLASS = 'hc-results-view__pulse-loader';

export const PulseLoader: Renderer = props => <CustomDiv {...props} defaultClassName={BASE_CLASS} />;
export const WhitesmokePatch: Renderer = props => <CustomDiv {...props} defaultClassName="bg-whitesmoke" />;
export const WhitePatch: Renderer = props => <CustomDiv {...props} defaultClassName="bg-white" />;
export const TransparentPatch: Renderer = props => <CustomDiv {...props} defaultClassName="bg-transparent" />;

export const Moldure = ({
    borderSize = 8,
    topBorderSize = borderSize,
    bottomBorderSize = borderSize,
    leftBorderSize = borderSize,
    rightBorderSize = borderSize,
    borderColor = 'white',
    height = 'full',
    width = 'full',
    children,
}: {
    width?: number | 'full';
    height?: number | 'full';

    topBorderSize?: number;
    bottomBorderSize?: number;
    leftBorderSize?: number;
    rightBorderSize?: number;

    borderSize?: number;
    borderColor?: string;

    children?: ReactNode;
}): JSX.Element => (
    <div className={`h-${height} w-${width}`}>
        <div className={`h-${topBorderSize} w-full bg-${borderColor}`} />
        <div
            className={`flex w-full h-full -mt-${topBorderSize} -mb-${bottomBorderSize} pt-${topBorderSize} pb-${bottomBorderSize}`}
        >
            <div className={`w-${leftBorderSize} bg-${borderColor}`} />
            <div
                className={classNames(
                    'h-full w-full',
                    `-mt-${topBorderSize} pt-${topBorderSize}`,
                    `-mb-${bottomBorderSize} pb-${bottomBorderSize}`,
                    `-ml-${leftBorderSize} pl-${leftBorderSize}`,
                    `-mr-${rightBorderSize} pr-${rightBorderSize}`,
                )}
            >
                {children}
            </div>
            <div className={`w-${rightBorderSize} bg-${borderColor}`} />
        </div>
        <div className={`h-${bottomBorderSize} w-full bg-${borderColor}`} />
    </div>
);
