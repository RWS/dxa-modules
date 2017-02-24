/**
 * Publication interface
 *
 * @export
 * @interface IPublication
 */
export interface IPublication {
    /**
     * Publication Id
     *
     * @type {string}
     * @memberOf IPublication
     */
    id: string;

    /**
     * Publication title
     *
     * @type {string}
     * @memberOf IPublication
     */
    title?: string;

    /**
     * Publication product family
     *
     * @type {string}
     * @memberOf IPublication
     */
    productFamily?: string;

    /**
     * Publication product release version
     *
     * @type {string}
     * @memberOf IPublication
     */
    productReleaseVersion?: string;
}
