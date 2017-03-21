import { Dispatch } from "redux";
import { createAction, Action } from "redux-actions";
import { IPageService } from "services/interfaces/PageService";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IState } from "store/interfaces/State";
import { PUBLICATIONS_LOADED, PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";

export { Action };

export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);
export const pageLoaded = createAction(PAGE_LOADED, pageInfo => pageInfo);
export const pageLoading = createAction(PAGE_LOADING, pageId => pageId);
export const pageError = createAction(PAGE_ERROR, (pageId, message) => ({ pageId, message }));

/**
 * Dispatcher function interface for page \ publications loading
 *
 * @export
 * @interface IDispatcherFunction
 */
export interface IDispatcherFunction {
    /**
     * Dispatcher
     *
     * @type {Function}
     * @memberOf IDispatcherFunction
     */
    (dispatch: Dispatch<IState>): void;
}

/**
 * Publications fetcher
 *
 * @param {IPublicationService} publicationService
 * @param {string} productFamily
 * @returns {Function}
 */
export const fetchPublications = (publicationService: IPublicationService, productFamily?: string): IDispatcherFunction => {
    return dispatch => {
        publicationService
            .getPublications(productFamily)
            .then((publications) => dispatch(publicationsLoaded(publications)));
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