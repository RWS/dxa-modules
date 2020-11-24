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

/**
 * Search query interface
 *
 * @export
 * @interface ISearchQuery
 */
export interface ISearchQuery {
    /**
     * Publication Id
     *
     * @type {string}
     * @memberOf ISearchQuery
     */

    publicationId?: string;
    /**
     * Search query
     *
     * @type {string}
     * @memberOf ISearchQuery
     */
    searchQuery: string;

    /**
     * Search start index
     *
     * @type {number}
     * @memberOf ISearchQuery
     */
    startIndex: number;

    /**
     * Search results count
     *
     * @type {number}
     * @memberOf ISearchQuery
     */
    count: number;

    /**
     * Search language
     *
     * @type {string}
     * @memberOf ISearchQuery
     */
    locale: string;
}

/**
 * Search results interface
 *
 * @export
 * @interface ISearchQueryResults
 */
export interface ISearchQueryResults {
    /**
     * Search total results
     *
     * @type {number}
     * @memberOf ISearchQueryResults
     */
    hits: number;
    /**
     * search start index
     *
     * @type {number}
     * @memberOf ISearchQueryResults
     */
    startIndex: number;
    /**
     * search query results
     *
     * @type {string}
     * @memberOf ISearchQueryResults
     */
    queryResults: ISearchQueryResult[];
}

/**
 * Search result interface
 *
 * @export
 * @interface ISearchQueryResult
 */
export interface ISearchQueryResult {
    /**
     * item Id
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    id: string;

    /**
     * item type
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    itemType: string | undefined | null;

    /**
     * Taxonomy title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    content: string;

    /**
     * product family title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    productFamilyTitle?: string;

    /**
     * product release version title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    productReleaseVersionTitle?: string;

    /**
     * Publication id
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    publicationId: string;

    /**
     * Publication title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    publicationTitle: string;

    /**
     * Page id
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    pageId: string;

    /**
     * Page title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    pageTitle: string;

    /**
     * content language
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    language?: string;

    /**
     * last modified date
     *
     * @type {Date}
     * @memberof ISearchResult
     */
    lastModifiedDate?: Date;
}
