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
     * Taxonomy title
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
 * Search resul interface
 *
 * @export
 * @interface ISearchResult
 */
export interface ISearchResult {
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
     * Page title
     *
     * @type {string}
     * @memberOf ISearchResult
     */
    pageTitle?: string;

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
