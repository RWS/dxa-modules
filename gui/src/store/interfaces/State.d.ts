import { IPagesMap } from "../reducers/Pages";
import { IPublicationsIdMap } from "store/reducers/Publications";

/**
 * State's current publication interface
 *
 * @export
 * @interface IPublicationCurrentState
 */
export interface IPublicationCurrentState {
    /**
     * Current publication id
     *
     * @type {string}
     * @memberOf IPublicationCurrentState
     */
    publicationId: string;
    /**
     * Current page id
     *
     * @type {string}
     * @memberOf IPublicationCurrentState
     */
    pageId: string;
    /**
     * Current anchor pointer
     *
     * @type {string}
     * @memberOf IPublicationCurrentState
     */
    anchor: string;
}

/**
 * State interface
 *
 * @export
 * @interface IState
 */
export interface IState {
    /**
     * Current UI language
     *
     * @type {string}
     * @memberOf IState
     */
    language: string;
    /**
     * Current selected publication
     *
     * @type {IPublicationState}
     * @memberOf IState
     */
    publication: IPublicationCurrentState;
    /**
     * Loaded publications
     *
     * @type {Object}
     * @memberOf IState
     */
    publications: {
        byId: IPublicationsIdMap;
    };
    /**
     * Loaded pages
     *
     * @type {Object}
     * @memberOf IState
     */
    pages: {
        byId: IPagesMap;
        loading: string[],
        errors: {[pageId: string]: string}
    };
}
