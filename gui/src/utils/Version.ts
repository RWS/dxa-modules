import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPublication } from "interfaces/Publication";

export default class Version {

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
     * @returns {IProductReleaseVersion[]} A sorted list of product release versions
     *
     * @memberOf Version
     */
    public static sortProductReleaseVersions(productFamily: string | null, publications: IPublication[]): IProductReleaseVersion[] {
        return [];
    }
}
