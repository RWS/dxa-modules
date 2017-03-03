import { IPublication } from "interfaces/Publication";

/**
 *
 * @export
 * @interface IState
 */
export interface IPublicationState {
    /**
     *
     * @type {(string | null)}
     * @memberOf IPublicationState
     */
    id: string | null;
    /**
     *
     * @type {(string | null)}
     * @memberOf IPublicationState
     */
    pageId: string | null;
    /**
     *
     * @type {IPublication[]}
     * @memberOf IPublicationState
     */
    publications: IPublication[];
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
    publication: IPublicationState;
}
