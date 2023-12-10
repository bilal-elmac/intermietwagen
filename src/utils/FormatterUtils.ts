import React from 'react';

type Formatter = (...chunks: string[]) => JSX.Element;

export const boldFormatter: Formatter = (...chunks) => <b>{chunks}</b>;

export const customButtonFormatter = (
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    // eslint-disable-next-line react/display-name
): Formatter => (...chunks): JSX.Element => <button {...props}>{chunks}</button>;

export const customAnchorFormatter = (
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    // eslint-disable-next-line react/display-name
): Formatter => (...chunks): JSX.Element => <a {...props}>{chunks}</a>;
