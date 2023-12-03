export const isEnumOf: <T>(e: { [s: string]: T }, v: T) => boolean = (e, v) => Object.values(e).includes(v);
