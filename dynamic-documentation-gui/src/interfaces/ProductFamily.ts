/**
 * Product Family interface
 *
 * @export
 * @interface IProductFamily
 */
export interface IProductFamily {
    /**
     * Product Family title
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    title: string;

    /**
     * Product Family description
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    description?: string;

    /**
     * If product family has a warning
     *
     * @type {string}
     * @memberOf IProductFamily
     */
    hasWarning?: boolean;
}
