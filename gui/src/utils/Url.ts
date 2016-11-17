import { slugify } from "./Slug";

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
            url += `/${encodeURIComponent(slugify(publicationTitle))}`;
        }
        return url;
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
            url += `/${encodeURIComponent(slugify(publicationTitle))}`;
            if (pageTitle) {
                url += `/${encodeURIComponent(slugify(pageTitle))}`;
            }
        }

        return url;
    }
}
