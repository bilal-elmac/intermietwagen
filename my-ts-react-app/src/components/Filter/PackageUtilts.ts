import { PackageType } from '../../domain/OfferPackage';

const PACKAGES_ORDER: PackageType[] = [PackageType.EXCELLENT, PackageType.GOOD, PackageType.BASIC];

export const sortPackages = <T>([...packages]: T[], getter: (i: T) => PackageType): T[] =>
    packages.sort((a, b) => PACKAGES_ORDER.indexOf(getter(a)) - PACKAGES_ORDER.indexOf(getter(b)));
