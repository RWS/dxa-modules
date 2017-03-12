import { IPublication } from "interfaces/Publication";

/**
 *
 * @export
 * @interface IState
 */
export interface IPublicationCurrentState {
    /**
     *
     * @type {(string | null)}
     * @memberOf IPublicationState
     */
    publicationId: string;
    /**
     *
     * @type {(string | null)}
     * @memberOf IPublicationState
     */
    pageId: string;
}

export interface IState {
    /**
     *
     * @type {string}
     * @memberOf IState
     */
    language: string;
    /**
     *
     * @type {IPublicationState}
     * @memberOf IState
     */
    publication: IPublicationCurrentState;
    publications: {
        byId: { [id: string]: IPublication };
    };
}
