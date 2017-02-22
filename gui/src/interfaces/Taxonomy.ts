/**
 * Taxonomy item interface
 *
 * @export
 * @interface ITaxonomy
 */
export interface ITaxonomy {

    /**
     * Taxonomy Id
     *
     * @type {string}
     * @memberOf ITaxonomy
     */

    id?: string;
    /**
     * Taxonomy title
     *
     * @type {string}
     * @memberOf ITaxonomy
     */
    title: string;

    /**
     * Taxonomy url
     *
     * @type {string}
     * @memberOf ITaxonomy
     */
    url?: string;

    /**
     * Determines if Taxonomy has child nodes
     *
     * @type {boolean}
     * @memberOf ITaxonomy
     */
    hasChildNodes: boolean;
}
