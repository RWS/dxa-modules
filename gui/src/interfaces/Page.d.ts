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
}
