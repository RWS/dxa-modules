import { slugify } from "utils/Slug";
import { path } from "utils/Path";

/**
 * Regex to validate if a url is an item Url
 *
 * example: /1656863/164363/publication-mp330/speed-dialling
 */
const ITEM_URL_REGEX = /^\/\d+\/\d+($|\/).*$/i;

/**
 * Maximum characters for a title
 */
const TITLE_MAX_CHARS = 250;

/**
 * Url helper methods
 *
 * @export
 * @class Url
 */
export class Url {

    /**
     * Creates a publication url
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} publicationTitle Publication title
     * @returns {string | undefined}
     *
     * @memberOf Url
     */
    public static getPublicationUrl(publicationId: string, publicationTitle?: string): string {
        const rootPath = path.getRootPath();
        let url = `${rootPath}${encodeURIComponent(publicationId)}`;
        if (publicationTitle) {
            url += `/${Url._processTitle(publicationTitle)}`;
        }
        return url;
    }

    /**
     * Checks if  a publication url
     *
     * @static
     * @param {string} [url] Item Url
     * @returns {boolean}
     *
     * @memberOf Url
     */
    public static itemUrlIsValid(url?: string | null): boolean {
        const rootPath = path.getRootPath();
        if (url && url.indexOf(rootPath) === 0) {
            // Remove root path
            const withoutRoot = url ? url.substring(rootPath.length - 1) : "";
            return withoutRoot.match(ITEM_URL_REGEX) !== null;
        }
        return false;
    }

    /**
     * Creates a page url
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     * @param {string} publicationTitle Publication title
     * @param {string} pageTitle Page title
     * @returns {string | undefined}
     *
     * @memberOf Url
     */
    public static getPageUrl(publicationId: string, pageId: string,
        publicationTitle?: string, pageTitle?: string): string {
        const rootPath = path.getRootPath();
        let url = `${rootPath}${encodeURIComponent(publicationId)}/${encodeURIComponent(pageId)}`;
        if (publicationTitle) {
            url += `/${Url._processTitle(publicationTitle)}`;
            if (pageTitle) {
                url += `/${Url._processTitle(pageTitle)}`;
            }
        }

        return url;
    }

    /**
     * Get an anchor url
     *
     * @static
     * @param {string} pageUrl The page url
     * @param {string} anchorId Anchor id
     * @returns {string}
     *
     * @memberOf Url
     */
    public static getAnchorUrl(pageUrl: string, anchorId: string): string {
        // Don't slugify the anchor as we need to be able to look it up again in the document
        return `${pageUrl}/${encodeURIComponent(anchorId)}`;
    }

    /**
     * Parse a page url
     *
     * @static
     * @param {string} url Url to parse
     * @param {string} [rootPath] Root path of the application
     * @returns {({ publicationId: string, pageId: string, publicationTitle?: string, pageTitle?: string } | undefined)}
     *
     * @memberOf Url
     */
    public static parsePageUrl(url: string, rootPath?: string): { publicationId: string, pageId: string, publicationTitle?: string, pageTitle?: string } | undefined {
        const rootPathValue = rootPath || path.getRootPath();
        const parts = url.substring(rootPathValue.length).split("/");
        if (parts.length >= 2) {
            return {
                publicationId: parts[0],
                pageId: parts[1],
                publicationTitle: parts[2],
                pageTitle: parts[3]
            };
        }
        return undefined;
    }

    private static _processTitle(title: string): string {
        // trim
        title = title.trim();
        // slugify
        title = slugify(title);
        // Encode
        title = encodeURIComponent(title);
        // Truncate
        if (title.length > TITLE_MAX_CHARS) {
            title = title.substring(0, 250);
        }
        return title;
    }
}
