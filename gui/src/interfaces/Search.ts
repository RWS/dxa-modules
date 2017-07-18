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
    language: string;
}

/**
 * Search resuls interface
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
 * Search resul interface
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
     * @type {string}
     * @memberof Date
     */
    lastModifiedDate?: Date;
}
