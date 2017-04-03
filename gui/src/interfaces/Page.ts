/**
 * Page interface
 *
 * @export
 * @interface IPage
 */
export interface IPage {
    /**
     * Page Id
     *
     * @type {string}
     * @memberOf IPage
     */
    id: string;

    /**
     * Page title
     *
     * @type {string}
     * @memberOf IPage
     */
    title?: string;

    /**
     * Page content
     *
     * @type {string}
     * @memberOf IPage
     */
    content: string;

    /**
     * Location of a page inside the Toc
     *
     * @type {string[] | undefined | null}
     * @memberOf IPage
     */
    sitemapIds: string[] | undefined | null;
}