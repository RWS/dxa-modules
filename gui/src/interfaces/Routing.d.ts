/**
 * Routing implementation
 */
export interface IRouting {
    /**
     * Use this hook to be notified on location changes
     *
     * @param {() => void} handler Handler which will be triggered upon a location change.
     */
    onLocationChanged(handler: () => void): void;

    /**
     * Get the absolute path
     *
     * @param {string} path Path
     * @returns {string}
     */
    getAbsolutePath(path: string): string;

    /**
     * Set publication location
     *
     * @param {string} publicationId Publication id
     * @param {string} publicationTitle Publication title
     * @param {string} [pageId] Page id
     * @param {string} [pageTitle] Page title
     */
    setPublicationLocation(publicationId: string, publicationTitle: string,
        pageId?: string, pageTitle?: string): void;

    /**
     * Gets publication location path
     *
     * @param {string} publicationId Publication id
     * @param {string} publicationTitle Publication title
     * @param {string} [pageId] Page id
     * @param {string} [pageTitle] Page title
     *
     * @returns {string} Publication location path
     */
    getPublicationLocationPath(publicationId: string, publicationTitle: string,
        pageId?: string, pageTitle?: string): string;

    /**
     * Get the current location within a publication
     *
     * @returns {IPublicationLocation | null}
     */
    getPublicationLocation(): IPublicationLocation | null;

    /**
     * Set page location
     *
     * @param {string} pageId Page id
     *
     * @memberOf IRouting
     */
    setPageLocation(pageId: string): void;

    /**
     * Gets page location path
     *
     * @param {string} pageId Page id
     *
     * @memberOf IRouting
     * @returns {string | undefined} Page location path
     */
    getPageLocationPath(pageId: string): string | undefined;

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
