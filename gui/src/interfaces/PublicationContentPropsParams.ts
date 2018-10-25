/**
 * PublicationContent component props params
 *
 * @export
 * @interface IPublicationContentPropsParams
 */
export interface IPublicationContentPropsParams {
    /**
     * Id of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    publicationId: string;

    /**
     * The page id or the title of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageIdOrPublicationTitle?: string;

    /**
     * Title of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    publicationTitle?: string;

    /**
     * Title of the current page
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageTitle?: string;

    /**
     * Anchor within the current page
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageAnchor?: string;
}