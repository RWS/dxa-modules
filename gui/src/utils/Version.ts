import { IPublication } from "interfaces/Publication";
import { DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION, DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";
import { String } from "utils/String";

const VERSION_REGEX = /^(.*)\((\d+(\.\d+)*)\)$/i;

export type ValuesComparerResult = -1 | 0 | 1;

export default class Version {
    /**
     * Sort product family versions. The more version, the higher in list. Products without number in its family are left unsorted.
     *
     * Logic to sort product family versions
     * 1. If the product family contains a version number between brackets at the end use this eg SDL Knowledge Center 2013 (11.0.4) => use 11.0.4 as version
     * 2. If there is no version info in the product release version sort based on publication version (eg if SDL Web 8 is used on version 3 and SDL Tridion 2013 on version 2
     * we know that SDL Web 8 is last)
     * 3. If a version is used on many publications and order could not be defined they as they are
     * @static
     * @param {string | null} productFamily Product family
     * @param {IPublication[]} publications The list of publications
     * @returns {string | null} A sorted list of product families
     *
     * @memberOf Version
     */
    public static sortProductFamilyVersions(publications: IPublication[]): (string | null)[] {
        const byMostPublicationsComparer = ((pubs: IPublication[]) => {
            const familyOccurenceCount: { [family: string]: number } = {};
            const getVersionsCount = (family: string): number => {
                if (!familyOccurenceCount[family]) {
                    familyOccurenceCount[family] = pubs.reduce(
                        (count: number, item: IPublication) =>
                            count + ((item.productFamily || []).includes(family) ? 1 : 0),
                        0
                    );
                }
                return familyOccurenceCount[family];
            };
            return (family1: string, family2: string): ValuesComparerResult =>
                this.byValueComparer(getVersionsCount(family1), getVersionsCount(family2));
        })(publications);

        const sortFamilies = (productFamilyA: string | null, productFamilyB: string | null): number => {
            if (productFamilyA && productFamilyB) {
                return (
                    // 1. Sort by Versions
                    Version.byVersionComparer(productFamilyA, productFamilyB) ||
                    // 2. If there are no versions then sort by publications occurances
                    byMostPublicationsComparer(productFamilyA, productFamilyB) ||
                    // 3. Otherwise sort by titles
                    Version.byTitleComparer(productFamilyA, productFamilyB)
                );
            }
            // -. By default, sort by values
            // If value is not defined it should go to the end
            return Version.byValueComparer(productFamilyB, productFamilyA);
        };

        // Convert to a product family version (remove version from end if it's in the correct format)
        // And take distinct product families

        const families = this._distinct([].concat.apply([], publications.map(pub => pub.productFamily || null)));

        // return this._distinct(
        //     [].concat
        //         .apply([], publications.map(pub => pub.productFamily || null))
        return (
            families
                .sort(sortFamilies)
                // Then we take versionless names
                .map(
                    (familyVersion: string | null) => {
                        const familyVersionMatch = familyVersion && familyVersion.match(VERSION_REGEX);
                        if (familyVersionMatch) {
                            familyVersion = familyVersionMatch[1];
                        }
                        return familyVersion && familyVersion.trim();
                    } //)
                )
        );
    }

    /**
     * Sort product release versions. Most recent first, oldest last.
     *
     * Logic to sort product release versions
     * 1. If the release version contains a version number between brackets at the end use this eg SDL Knowledge Center 2013 (11.0.4) => use 11.0.4 as version
     * 2. If there is no version info in the product release version sort based on publication version (eg if SDL Web 8 is used on version 3 and SDL Tridion 2013 on version 2
     * we know that SDL Web 8 is newer)
     * 3. If a release version is used on many publications and order could not be defined by publication version the
     * creation date metadata of the publication version is used (most recent data is latest release version)
     * @static
     * @param {string | null} productFamily Product family
     * @param {IPublication[]} publications The list of publications
     * @returns {string | null} A sorted list of product release version titles
     *
     * @memberOf Version
     */
    public static sortProductReleaseVersions(publications: IPublication[]): (string | null)[] {
        const byLatestCreatedOnDateComparer = ((pubs: IPublication[]) => {
            const latestDates: { [releaseVersion: string]: number } = {};
            const getLatestDate = (releaseVersion: string): number => {
                if (!latestDates[releaseVersion]) {
                    latestDates[releaseVersion] = Math.max(
                        ...pubs
                            .filter(
                                pub => pub.productReleaseVersion && pub.productReleaseVersion.includes(releaseVersion)
                            )
                            .map(p => p.createdOn.getTime())
                    );
                }
                return latestDates[releaseVersion];
            };
            return (version1: string, version2: string): ValuesComparerResult =>
                this.byValueComparer(getLatestDate(version1), getLatestDate(version2));
        })(publications);

        const byMostPublicationsComparer = ((pubs: IPublication[]) => {
            const versionOccurenceCount: { [version: string]: number } = {};
            const getVersionsCount = (version: string): number => {
                if (!versionOccurenceCount[version]) {
                    versionOccurenceCount[version] = pubs.reduce(
                        (count: number, item: IPublication) =>
                            count + ((item.productReleaseVersion || []).includes(version) ? 1 : 0),
                        0
                    );
                }
                return versionOccurenceCount[version];
            };
            return (version1: string, version2: string): ValuesComparerResult =>
                this.byValueComparer(getVersionsCount(version1), getVersionsCount(version2));
        })(publications);

        const byHighestPublicationVersionComparer = ((pubs: IPublication[]) => {
            const highestPublicationsVersions: { [releaseVersion: string]: number } = {};
            const getHighestVersion = (releaseVersion: string): number => {
                if (!highestPublicationsVersions[releaseVersion]) {
                    highestPublicationsVersions[releaseVersion] = Math.max(
                        ...pubs
                            .filter(
                                pub => pub.productReleaseVersion && pub.productReleaseVersion.includes(releaseVersion)
                            )
                            .map(p => +p.version || 0)
                    );
                }
                return highestPublicationsVersions[releaseVersion];
            };
            return (version1: string, version2: string): ValuesComparerResult =>
                this.byValueComparer(getHighestVersion(version1), getHighestVersion(version2));
        })(publications);

        const byVersionComparer = (version1: string, version2: string): ValuesComparerResult => {
            if (version1 && version2) {
                return (
                    // 1. If the release version contains a version number between brackets at the end use
                    // this eg SDL Knowledge Center 2013 (11.0.4) => use 11.0.4 as version
                    Version.byVersionComparer(version1, version2) ||
                    // 2. If there is no version info in the product release version sort based on publication
                    // version (eg if SDL Web 8 is used on version 3 and SDL Tridion 2013 on version 2
                    // we know that SDL Web 8 is newer)
                    byHighestPublicationVersionComparer(version1, version2) ||
                    // 3. If a release version is used on many publications and order could not be defined by publication version the
                    //  creation date metadata of the publication version is used (most recent data is latest release version)
                    byLatestCreatedOnDateComparer(version1, version2) ||
                    // 4. If a latest created on dates are equal, then compare by most publications occurances
                    byMostPublicationsComparer(version1, version2) ||
                    // 5. Eventually, compare by Title
                    Version.byTitleComparer(version1, version2)
                );
            } else if (!version1) {
                return 1;
            } else if (!version2) {
                return -1;
            } else {
                return 0;
            }
        };

        // Take distinct product release versions
        return this._distinct(
            // First, get flatten list of release versions
            [].concat
                .apply([], publications.map(pub => pub.productReleaseVersion || null))
                .sort(byVersionComparer)
                // Convert to a product release version (remove version from end if it's in the correct format)
                .map((releaseVersion: string) => {
                    const releaseVersionMatch = releaseVersion && releaseVersion.match(VERSION_REGEX);
                    if (releaseVersionMatch) {
                        releaseVersion = releaseVersionMatch[1];
                    }
                    return releaseVersion && releaseVersion.trim();
                })
        );
    }

    /**
     * Compare two versions
     * @param v1 First version
     * @param v2 Second version
     *
     * @returns {ValuesComparerResult} 1 = Version 1 is greater, -1 = Version 2 is greater, 0 Versions are equal
     */
    public static compareVersion(v1: string, v2: string): ValuesComparerResult {
        const v1parts = v1.split(".");
        const v2parts = v2.split(".");

        for (let i = 0; i < v1parts.length; ++i) {
            if (v2parts.length === i) {
                return 1;
            }

            if (Number(v1parts[i]) === Number(v2parts[i])) {
                continue;
            } else if (Number(v1parts[i]) > Number(v2parts[i])) {
                return 1;
            } else {
                return -1;
            }
        }

        if (v1parts.length !== v2parts.length) {
            return -1;
        }

        // Versions are equal
        return 0;
    }

    /**
     * Normalize a product family value
     * Removes for example a version at the end of a value eg RV (1.0.0) become RV
     *
     * @static
     * @param {string | null | undefined} productFamily Product family
     * @returns {string} Normalized product family name
     *
     * @memberOf Version
     */
    public static normalizeProductFamily(productFamilyName: string | null | undefined): string {
        return Version.normalize(productFamilyName) || String.normalize(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE);
    }

    /**
     * Normalize a product release version
     * Removes for example a version at the end of a value eg RV (1.0.0) become RV
     *
     * @static
     * @param {string | null | undefined} productReleaseVersion Product release version
     * @returns {string} Normalized release version
     *
     * @memberOf Version
     */
    public static normalizeReleaseVersion(productReleaseVersion: string | null | undefined): string {
        return Version.normalize(productReleaseVersion) || String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION);
    }

    /* Private methods */

    /**
     * Compare two titles values
     * @param title1 First Title
     * @param title2 Second Title
     *
     * @returns {ValuesComparerResult} 1 = Version 1 is greater, -1 = Version 2 is greater, 0 Versions are equal
     */
    private static byTitleComparer(title1: string = "", title2: string = ""): ValuesComparerResult {
        return title1.toLowerCase().localeCompare(title2.toLowerCase()) as ValuesComparerResult;
    }

    /**
     * Compare two versions
     * @param version1 First Version
     * @param version2 Second Version
     *
     * @returns {ValuesComparerResult} 1 = Version 1 is greater, -1 = Version 2 is greater, 0 Versions are equal
     */
    private static byVersionComparer(version1: string, version2: string): ValuesComparerResult {
        const versionInTitleA = version1 && version1.match(VERSION_REGEX);
        const versionInTitleB = version2 && version2.match(VERSION_REGEX);

        // First compare by version in title
        if (versionInTitleA && versionInTitleB) {
            return Version.compareVersion(versionInTitleA[2], versionInTitleB[2]);
        } else if (versionInTitleA) {
            return -1;
        } else if (versionInTitleB) {
            return 1;
        }
        return 0;
    }

    /**
     * Compare two primitive values
     * @param v1 First version
     * @param v2 Second version
     *
     * @returns {ValuesComparerResult} 1 = Version 1 is greater, -1 = Version 2 is greater, 0 Versions are equal
     */
    private static byValueComparer(v1: string | number | null, v2: string | number | null): ValuesComparerResult {
        if (v1 && v2) {
            if (v1 < v2) {
                return 1;
            } else if (v1 > v2) {
                return -1;
            }
        } else if (v1) {
            return 1;
        } else if (v2) {
            return -1;
        }
        return 0;
    }

    /**
     * Normalize version value
     * Removes for example a version at the end of a value eg RV (1.0.0) become RV
     *
     * @static
     * @param {string | null | undefined} version Product version
     * @returns {string} Normalized version
     *
     * @memberOf Version
     */
    private static normalize(version: string | null | undefined): string | null {
        if (version) {
            const versionMatch = version.match(VERSION_REGEX);
            return versionMatch ? String.normalize(versionMatch[1]) : String.normalize(version);
        }

        return null;
    }

    private static _distinct(collection: (string | null)[]): (string | null)[] {
        return collection.filter((value, index, self) => self.indexOf(value) === index);
    }
}
