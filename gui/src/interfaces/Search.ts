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
}
