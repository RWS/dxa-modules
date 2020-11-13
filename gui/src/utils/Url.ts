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

export interface IPageParams {
    publicationId: string;
    pageId: string;
    publicationTitle?: string;
    pageTitle?: string;
}

/**
 * Url helper methods
 *
 * @export
 * @class Url
 */
export class Url {

    /**
     * Creates a product family  url
     *
     * @static
     * @param {string} productFamily product family
     * @param {string} [productReleaseVersion] product release version
     * @returns {string}
     *
     * @memberOf Url
     */
    public static getProductFamilyUrl(productFamily: string, productReleaseVersion?: string): string {
        const rootPath = path.getRootPath();
        // Don't slugify product family as we need to be able to look it up again
        const defaultUrl = `${rootPath}publications/${encodeURIComponent(productFamily)}`;
        if (productReleaseVersion) {
            return `${defaultUrl}/${encodeURIComponent(productReleaseVersion)}`;
        }
        return defaultUrl;
    }

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
            url += `/${Url._processLink(publicationTitle)}`;
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
            url += `/${Url._processLink(publicationTitle)}`;
            if (pageTitle) {
                url += `/${Url._processLink(pageTitle)}`;
            }
        }
        return url;
    }

    /**
     * Creates a binary url
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} binaryId binary id
     * @returns {string}
     *
     * @memberOf Url
     */
    public static getBinaryUrl(publicationId: string, binaryId: string): string {
        const rootPath = path.getRootPath();
        let url = `${rootPath}binary/${encodeURIComponent(publicationId)}/${encodeURIComponent(binaryId)}`;
        return url;
    }

    /**
     * Creates a page/binary url depending on binary parameter
     *
     * @static
     * @param {string} publicationId Publication id
     * @param {string} objectId page id or binary id
     * @returns {string}
     * @param {string} publicationTitle Publication title
     * @param {string} pageTitle Page title
     * @param {string} binary flag
     * @memberOf Url
     */
    public static getPageOrBinaryUrl(publicationId: string, objectId: string, publicationTitle?: string,
                                     pageTitle?: string, binary?: string | undefined | null): string {
        if (binary) {
            return Url.getBinaryUrl(publicationId, objectId);
        }
        return Url.getPageUrl(publicationId, objectId, publicationTitle, pageTitle);
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
     * Get search url
     *
     * @static
     * @param {string} searchQuery The search query
     * @param {string} publicationId publication id for search
     * @returns {string}
     *
     * @memberOf Url
     */
    public static getSearchUrl(searchQuery: string, publicationId?: string): string {
        const rootPath = path.getRootPath();
        let defaultUrl = `${rootPath}search`;
        if (publicationId) {
            defaultUrl = `${defaultUrl}/${encodeURIComponent(publicationId)}`;
        }
        return `${defaultUrl}/${encodeURIComponent(searchQuery)}`;
    }

    /**
     * Parse a page url
     * Format of a page url is "<context><pub-id>/<page-id>/<publication-title>/<page-title>"
     *
     * @static
     * @param {string} url Url to parse
     * @param {string} [rootPath] Root path of the application
     * @returns {({ publicationId: string, pageId: string, publicationTitle?: string, pageTitle?: string } | undefined)}
     * Returns an object with the different parameter values for the page url. If the url is not correct undefined is returned.
     *
     * @memberOf Url
     */
    public static parsePageUrl(url: string, rootPath?: string): IPageParams | undefined {
        const rootPathValue = (rootPath || path.getRootPath()).replace(/\/$/, "");
        const pageParh = url.substring(rootPathValue.length);
        const params = /\/([\d\-]+)(?:\/([\d\-]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?$/.exec(pageParh);

        return params && {
            publicationId: decodeURIComponent(params[1]),
            pageId: decodeURIComponent(params[2]),
            publicationTitle: params[3] ? decodeURIComponent(params[3]) : undefined,
            pageTitle: params[4] ? decodeURIComponent(params[4]) : undefined
        } || void 0;
    }

    private static _processLink(link: string): string {
        // trim
        link = link.trim();
        // slugify
        link = slugify(link);
        // Encode
        link = encodeURIComponent(link);
        return link;
    }
}
