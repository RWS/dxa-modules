/**
 * Routing implementation
 */
export interface IRouting {
    /**
     * Get the absolute path
     *
     * @param {string} path Path
     * @returns {string}
     */
    getAbsolutePath(path: string): string;

    /**
     * gets the history
     *
     * @param {string} pageId Page id
     *
     * @memberOf IRouting
     */
    getHistory(): HistoryModule.History;
}

/**
 * Publication location
 *
 * @interface IPublicationLocation
 */
interface IPublicationLocation {
    /**
     * Publication id
     *
     * @type {string}
     */
    publicationId: string;
    /**
     * Page id
     *
     * @type {string | null}
     */
    pageId: string | null;
}
