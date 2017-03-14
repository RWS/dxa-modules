// import { PageService } from "test/mocks/services/PageService";
import { createAction, Action } from "redux-actions";
import { Dispatch } from "redux";
import { IState } from "store/interfaces/State";
import { PUBLICATIONS_LOADED, PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IPageService } from "services/interfaces/PageService";

export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);
export const pageLoaded = createAction(PAGE_LOADED, pageInfo => pageInfo);
export const pageLoading = createAction(PAGE_LOADING, pageId => pageId);
export const pageError = createAction(PAGE_ERROR, (pageId, message) => ({ pageId, message }));

export { Action };

/* if anybody know how to make it readble with ts? */
export const fetchPublications = (publicationService: IPublicationService, productFamily?: string): (dispatch: Dispatch<IState>) => void => (dispatch) => {
    publicationService.getPublications(productFamily)
        .then((publications) => dispatch(publicationsLoaded(publications)));
};

export const fetchPage = (pageService: IPageService, publicationId: string, pageId: string): (dispatch: Dispatch<IState>) => void => (dispatch) => {
    dispatch(pageLoading(pageId));
    pageService.getPageInfo(publicationId, pageId)
        .then(
            (page) => dispatch(pageLoaded(page)),
            (errorMessage) => dispatch(pageError(pageId, errorMessage))
        );
};