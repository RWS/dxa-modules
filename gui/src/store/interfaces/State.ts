import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IConditionsState } from "store/interfaces/Conditions";
import { IComments } from "store/interfaces/Comments";
import { ISearchResults } from "store/interfaces/Search";

export interface IProductReleaseVersionState {
    byProductFamily: IProductReleaseVersionMap;
}

export interface IProductReleaseVersionMap {
    [id: string]: IProductReleaseVersion[];
}

/**
 * Pages dictionary based on id
 *
 * @export
 * @interface IPagesMap
 */
export interface IPagesMap {
    [id: string]: IPage;
}

/**
 * Pages' errors dictionary based on page id
 *
 * @export
 * @interface IPageErrorsMap
 */
export interface IPageErrorsMap {
    [pageId: string]: string;
}

/**
 * Pages interface in the state
 *
 * @export
 * @interface IPageState
 */
export interface IPageState {
    /**
     * Pages dictionary
     *
     * @type {IPagesMap}
     * @memberOf IPageState
     */
    byId: IPagesMap;
    /**
     * Errors dictionary
     *
     * @type {IPageErrorsMap}
     * @memberOf IPageState
     */
    errors: IPageErrorsMap;
    /**
     * Loading pages id that are loading
     *
     * @type {string[]}
     * @memberOf IPageState
     */
    loading: string[];
}

/**
 * Publications dictionary based on id
 *
 * @export
 * @interface IPagesMap
 */
export interface IPublicationsMap {
    [id: string]: IPublication;
}

/**
 * Publications interface in the state
 *
 * @export
 * @interface IPageState
 */

export interface IPublicationsState {
    byId: IPublicationsMap;

    /**
     * Flag that show if list of publications is requsted
     * We cannot do flag per publicaiton like we did for pages.
     */
    isLoading: boolean;

    /**
     * It's called lastError, because it might happen that some  publications were loaded soem not
     */
    lastError: string;
}

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
     * Conditions
     *
     * @type {IConditionsState}
     * @memberof IState
     */
    conditions: IConditionsState;

    /**
     * Comments
     *
     * @type {IComments}
     * @memberof IState
     */
    comments: IComments;
    /**
     * Current selected publication
     *
     * @type {IPublicationState}
     * @memberOf IState
     */
    publication: IPublicationCurrentState;

    /**
     * Publications and state
     *
     * @type {Object}
     * @memberOf IState
     */
    publications: IPublicationsState;

    /**
     * Pages and it states
     *
     * @type {Object}
     * @memberOf IState
     */
    pages: IPageState;

    /**
     * Release versions
     *
     * @type {IProductReleaseVersionState}
     * @memberof IState
     */
    releaseVersions: IProductReleaseVersionState;

    /**
     * Search results
     *
     * @type {ISearchResultsState}
     * @memberof IState
     */
    searchResults: ISearchResults;
}
