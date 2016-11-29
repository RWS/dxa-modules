import { slugify } from "utils/Slug";

/**
 * Regex to validate if a url is an item Url
 *
 * example: /1656863/164363/publication-mp330/speed-dialling
 */
const ITEM_URL_REGEX = /^\/\d+\/\d+(\/([^\/]+(\/([^\/]+)?)?)?)?$/i;

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
        let url = `/${encodeURIComponent(publicationId)}`;
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
        return (url && url.match(ITEM_URL_REGEX)) != null;
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

        let url = `/${encodeURIComponent(publicationId)}/${encodeURIComponent(pageId)}`;
        if (publicationTitle) {
            url += `/${Url._processTitle(publicationTitle)}`;
            if (pageTitle) {
                url += `/${Url._processTitle(pageTitle)}`;
            }
        }

        return url;
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
