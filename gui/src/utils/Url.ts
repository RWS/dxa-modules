import * as slug from "slug";

/**
 * Url helper methods
 *
 * @export
 * @class Url
 */
export class Url {

    /**
     * Options to slugify titles in Url
     */
    private static _slugOptions: {
        lower: true
    };

    /**
     * Gets the publication location relative path
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} publicationTitle Publication title
     * @returns {string | undefined}
     *
     * @memberOf TcmUri
     */
    public static getPublicationLocation(publicationId: string, publicationTitle?: string): string {
        let url = `/${encodeURIComponent(publicationId)}`;
        if (publicationTitle) {
            url += `/${slug(publicationTitle, this._slugOptions)}`;
        }
        return url;
    }

    /**
     * Gets the page location relative path
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     * @param {string} publicationTitle Publication title
     * @param {string} pageTitle Page title
     * @returns {string | undefined}
     *
     * @memberOf TcmUri
     */
    public static getPageLocation(publicationId: string, pageId: string,
        publicationTitle?: string, pageTitle?: string): string {

        let url = `/${encodeURIComponent(publicationId)}/${encodeURIComponent(pageId)}`;
        if (publicationTitle) {
            url += `/${slug(publicationTitle, this._slugOptions)}`;
            if (pageTitle) {
                url += `/${slug(pageTitle, this._slugOptions)}`;
            }
        }

        return url;
    }
}
