import { path } from "utils/Path";
import { IWindow } from "interfaces/Window";

const mocksEnabled = (): boolean => (window as IWindow).SdlDitaDeliveryMocksEnabled || false;
const mocksEndPoint = `/$mocks$`;

/**
 * Utilities for generating api urls
 *
 * @export
 * @class Api
 */
export class Api {
    /**
     * Get navigation links urls
     * Use this url to get the path of a taxonomy item in the toc
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} sitemapItemId Sitemap item id
     * @returns {string}
     *
     * @memberOf Api
     */
    public static getNavigationLinksUrl(publicationId: string, sitemapItemId: string): string {
        const encodedPubId = encodeURIComponent(publicationId);
        const encodedSitemapItemId = encodeURIComponent(sitemapItemId);
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/navigation-${encodedPubId}-${encodedSitemapItemId}.json`);
        } else {
            return path.getAbsolutePath(`api/toc/${encodedPubId}/${encodedSitemapItemId}?includeAncestors=true`);
        }
    }

    /**
     * Get page url
     * Use this url to retrieve contents / metadata for a page
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     * @returns {string}
     *
     * @memberOf Api
     */
    public static getPageUrl(publicationId: string, pageId: string): string {
        const encodedPubId = encodeURIComponent(publicationId);
        const encodedPageId = encodeURIComponent(pageId);
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/page-${encodedPubId}-${encodedPageId}.json`);
        } else {
            return path.getAbsolutePath(`api/page/${encodedPubId}/${encodedPageId}`);
        }
    }

    /**
     * Get publications url
     * Use this url to retrieve all publications and their metadata
     *
     * @static
     * @returns {string}
     *
     * @memberOf Api
     */
    public static getPublicationsUrl(): string {
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/publications.json`);
        } else {
            return path.getAbsolutePath(`api/publications`);
        }
    }

    /**
     * Get toc items url
     * Use this url to retrieve all childs items of a table of contents item
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} sitemapItemId Sitemap item id
     * @returns {string}
     *
     * @memberOf Api
     */
    public static getTocItemsUrl(publicationId: string, sitemapItemId: string): string {
        const encodedPubId = encodeURIComponent(publicationId);
        const encodedSitemapItemId = encodeURIComponent(sitemapItemId);
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/toc-${encodedPubId}-${encodedSitemapItemId}.json`);
        } else {
            return path.getAbsolutePath(`api/toc/${encodedPubId}/${encodedSitemapItemId}`);
        }
    }

    /**
     * Get conditions url
     * Use this url to retrive all conditions of publication
     *
     * @static
     * @param {string} publicationId Publication id
     * @returns {string}
     *
     * @memberOf Api
     */
    public static getConditionsUrl(publicationId: string): string {
        const encodedPubId = encodeURIComponent(publicationId);
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/conditions-${encodedPubId}.json`);
        } else {
            return path.getAbsolutePath(`api/conditions/${encodedPubId}`);
        }
    }

    /**
     * Get comments url
     * Use this url to retrive all comments of page
     *
     * @static
     * @param {string} publicationId
     * @param {string} pageId
     * @param {boolean} descending
     * @param {number} top
     * @param {number} skip
     * @param {number[]} status
     * @returns {string}
     *
     * @memberof Api
     */
    public static getCommentsUrl(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): string {
        const encodedPubId = encodeURIComponent(publicationId);
        const encodedPageId = encodeURIComponent(pageId);

        /* istanbul ignore else */
        if (mocksEnabled()) {
            // Get all comments for a page without any filtering
            return path.getAbsolutePath(`${mocksEndPoint}/comments-${encodedPubId}-${encodedPageId}.json`);
        } else {
            return path.getAbsolutePath(`api/comments/${encodedPubId}/${encodedPageId}?descending=${descending}&top=${top}&skip=${skip}&status[]=${status}`);
        }
    }

}
