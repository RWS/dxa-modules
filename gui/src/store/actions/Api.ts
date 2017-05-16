import { createAction, Action } from "redux-actions";
import { IPageService } from "services/interfaces/PageService";
import { IPublicationService } from "services/interfaces/PublicationService";

import {
    PAGE_LOADED, PAGE_LOADING, PAGE_ERROR,
    PUBLICATIONS_LOADED, PUBLICATIONS_LOADING, PUBLICATIONS_LOADING_ERROR,
    RELEASE_VERSIONS_LOADING, RELEASE_VERSIONS_LOADED,
    CONDITIONES_LOADED, CONDITIONES_LOADING, CONDITIONES_ERROR,
    updateCurrentPublication
} from "./Actions";

import { getPubById, getPubList } from "store/reducers/Reducer";
import { Dispatch } from "redux";
import { IState } from "store/interfaces/State";
import { IConditionMap } from "store/interfaces/State";

export { getPubById, getPubList }
export { Action };

/**
 * Dispatcher function interface for page \ publications loading
 *
 * @export
 * @interface IDispatcherFunction
 */
export interface IDispatcherAndStateFunction {
    /**
     * Dispatcher
     *
     * @type {Function}
     * @memberOf IDispatcherFunction
     */
    (dispatch: Dispatch<IState>, getState: () => IState): void;
}

export interface IDispatcherFunction {
    /**
     * Dispatcher
     *
     * @type {Function}
     * @memberOf IDispatcherFunction
     */
    (dispatch: Dispatch<IState>): void;
}

export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);
export const pageLoaded = createAction(PAGE_LOADED, pageInfo => pageInfo);
export const pageLoading = createAction(PAGE_LOADING, pageId => pageId);
export const pageError = createAction(PAGE_ERROR, (pageId: string, message: string) => ({ pageId, message }));

export const publicationsLoading = createAction(PUBLICATIONS_LOADING);
export const publicationsLoadingError = createAction(PUBLICATIONS_LOADING_ERROR);

export const releaseVersionsLoading = createAction(RELEASE_VERSIONS_LOADING, (pubId) => pubId);
export const releaseVersionsLoaded = createAction(RELEASE_VERSIONS_LOADED, (productFamily, releaseVersions) => ({ productFamily, releaseVersions }));

export const conditionsLoading = createAction(CONDITIONES_LOADING, (pubId: string) => pubId);
export const conditionsLoaded = createAction(CONDITIONES_LOADED, (pubId: string, conditions: IConditionMap) => ({ pubId, conditions }));
export const conditionsError = createAction(CONDITIONES_ERROR, (pubId: string, error: {}) => ({ pubId, error }));

/**
 * Publications fetcher
 *
 * @param {IPublicationService} publicationService
 * @param {string} productFamily
 * @returns {Function}
 */
export const fetchPublications = (publicationService: IPublicationService,
    productFamily?: string,
    productReleaseVersion?: string): IDispatcherFunction => {
    return dispatch => {
        dispatch(publicationsLoading());
        publicationService
            .getPublications(productFamily, productReleaseVersion)
            .then(
            (publications) => dispatch(publicationsLoaded(publications)),
            (errorMessage) => dispatch(publicationsLoadingError(errorMessage))
            );
    };
};

/**
 * Page fetcher
 *
 * @param {IPageService} pageService
 * @param {string} publicationId
 * @param {string} pageId
 * @returns {Function}
 */
export const fetchPage = (pageService: IPageService, publicationId: string, pageId: string): IDispatcherFunction => {
    return dispatch => {
        dispatch(pageLoading(pageId));

        pageService
            .getPageInfo(publicationId, pageId)
            .then(
            (page) => dispatch(pageLoaded(page)),
            (errorMessage) => dispatch(pageError(pageId, errorMessage))
            );
    };
};

export const fetchProductReleaseVersions = (publicationService: IPublicationService, publicationId: string): IDispatcherFunction => {
    return dispatch => {
        dispatch(releaseVersionsLoading());

        publicationService
            .getProductReleaseVersionsByPublicationId(publicationId)
            .then(
            (releaseVersions) => dispatch(releaseVersionsLoaded(publicationId, releaseVersions)),
            (errorMessage) => dispatch(releaseVersionsLoaded(publicationId, { title: errorMessage, value: "" }))
            );
    };
};

export const fetchProductReleaseVersionsByProductFamily = (publicationService: IPublicationService, productFamily: string): IDispatcherFunction => {
    return dispatch => {
        dispatch(releaseVersionsLoading());
        publicationService
            .getProductReleaseVersions(productFamily)
            .then(
            (releaseVersions) => dispatch(releaseVersionsLoaded(productFamily, releaseVersions)),
            (errorMessage) => dispatch(releaseVersionsLoaded(productFamily, { title: errorMessage, value: "" }))
            );
    };
};

export const fetchConditions = (pubId: string): IDispatcherFunction => {
    return dispatch => {
        dispatch(conditionsLoading(pubId));
        /* need something that works for server rendering */
        fetch(`/app/gui/mocks/conditions-${pubId}.json`).then(
            response => response.json()
        ).then(
            data => dispatch(conditionsLoaded(pubId, data)),
            error => dispatch(conditionsError(pubId, error))
            );
    };
};

/**
 * This functions tries to find publication by releaseVersion and publicationId
 * First it tries to find for publicaotn language, second for ui language, then takes any
 * NOTE: this function does not do any fetching, but I put it here because there is a very wired bug(state is always empty) if
 * I import getPubById and getPubList in ./Action files. (Cann't explain it);
 * @param publicaitonId
 * @param releaseVersion
 */
export const setCurrentPublicationByReleaseVersion = (publicaitonId: string, productReleaseVersion: string): IDispatcherAndStateFunction => {
    return (dispatch, getState): void => {
        const state = getState();
        const publication = getPubById(state, publicaitonId);
        //try to find for this language
        let pubs = getPubList(state, {
            language: publication.language,
            logicalId: publication.logicalId,
            productReleaseVersion,
            "!id": publicaitonId
        });

        //try for find publicaitons for ui language if for content language not found
        if (!pubs.length && publication.language !== state.language) {
            pubs = getPubList(state, {
                language: publication.language,
                logicalId: publication.logicalId,
                productReleaseVersion,
                "!id": publicaitonId
            });
        }

        //try to find publication on any language
        if (!pubs.length) {
            pubs = getPubList(state, {
                logicalId: publication.logicalId,
                productReleaseVersion,
                "!id": publicaitonId
            });
        }

        if (pubs[0]) {
            dispatch(updateCurrentPublication(pubs[0].id));
        }
    };
};
