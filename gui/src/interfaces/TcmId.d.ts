/**
 * Tcm id
 *
 * @export
 * @interface ITcmId
 */
export interface ITcmId {
    /**
     * Namespace (eg ish, tcm)
     *
     * @type {string}
     * @memberOf TcmId
     */
    namespace: string;
    /**
     * Publication id
     *
     * @type {string}
     * @memberOf TcmId
     */
    publicationId: string;
    /**
     * Item id
     *
     * @type {string}
     * @memberOf TcmId
     */
    itemId: string;
    /**
     * Item type
     *
     * @type {CdItemTypes}
     * @memberOf TcmId
     */
    itemType: CdItemTypes;
}

/**
 * Content Delivery item types
 *
 * @export
 * @enum {number}
 */
export const enum CdItemTypes {
    Publication = 1,
    Component = 16,
    Category = 512,
    Taxonomy = 1024
}
