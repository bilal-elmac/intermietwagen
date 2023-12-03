import uniqueId from 'uniqid';

let uniquePreffix = 0;
export const unique = (): string => uniqueId(String(++uniquePreffix));
