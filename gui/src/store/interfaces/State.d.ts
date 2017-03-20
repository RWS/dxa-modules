import { IPagesMap } from "../reducers/Pages";
import { IPublicationsIdMap } from "store/reducers/Publications";

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

    anchor: string;
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
        byId: IPublicationsIdMap;
    };

    pages: {
        byId: IPagesMap;
        loading: string[],
        errors: {[pageId: string]: string}
    };
}
