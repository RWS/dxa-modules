/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { path } from "utils/Path";
import { IWindow } from "interfaces/Window";
import { IError } from "interfaces/Error";

const mocksEnabled = (): boolean => (window as IWindow).SdlDitaDeliveryMocksEnabled || false;
const mocksEndPoint = `/$mocks$`;

export const API_REQUEST_TYPE_JSON = "application/json";
export const API_REQUEST_TYPE_FORM = "application/x-www-form-urlencoded";

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
     * Use this url to retrieve all conditions of publication
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
     * Use this url to retrieve all comments of page
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
            return path.getAbsolutePath(`api/comments/${encodedPubId}/${encodedPageId}?descending=${descending}&top=${top}&skip=${skip}&status%5B%5D=${status}`);
        }
    }

    /**
     * Get comment post url
     * Use this url to post page comment
     *
     * @static
     * @param {string} publicationId
     * @param {string} pageId
     * @returns {string}
     *
     * @memberof Api
     */
    public static getSaveCommentUrl(): string {
        /* istanbul ignore else */
        if (mocksEnabled()) {
            // Can`t set comments for mock
            throw {
                message: "Mocks are not allowed when posting comments",
                statusCode: "500"
            } as IError;
        } else {
            return path.getAbsolutePath(`api/comments/add`);
        }
    }

    /**
     * Get search url
     * Use this url to search content
     *
     * @static
     * @param {string} locale
     * @param {string} publicationId
     * @param {number} startIndex
     * @returns {string}
     *
     * @memberof Api
     */
    public static getSearchUrl(locale: string, startIndex: number, publicationId?: string): string {
        /* istanbul ignore else */
        if (mocksEnabled()) {
            // Get search results for publication
            if (publicationId) {
                return path.getAbsolutePath(`${mocksEndPoint}/search-${publicationId}-${locale}-${startIndex}.json`);
            } else {
                return path.getAbsolutePath(`${mocksEndPoint}/search-${locale}-${startIndex}.json`);
            }
        } else {
            return path.getAbsolutePath("api/search");
        }
    }

    /**
     * Get page Id by logical reference Id
     * Use this url to get page by logicalRefId
     *
     * @static
     * @param {string} publicationId
     * @param {string} logicalId
     * @returns {string}
     *
     * @memberof Api
     */
    public static getPageIdByReferenceUrl(publicationId: string, logicalId: string): string {
        const encodedPubId = encodeURIComponent(publicationId);
        const encodedLogicalId = encodeURIComponent(logicalId);
        /* istanbul ignore else */
        if (mocksEnabled()) {
            return path.getAbsolutePath(`${mocksEndPoint}/pageidbyreference-${encodedPubId}-${encodedLogicalId}.json`);
        } else {
            return path.getAbsolutePath(`api/pageIdByReference/${encodedPubId}/${encodedLogicalId}`);
        }
    }
}
