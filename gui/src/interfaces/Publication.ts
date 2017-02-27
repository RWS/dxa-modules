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
     * @type {string | null}
     * @memberOf IPublication
     */
    productFamily?: string | null;

    /**
     * Publication product release version
     *
     * @type {string | null}
     * @memberOf IPublication
     */
    productReleaseVersion?: string | null;
}
