// import { PageService } from "test/mocks/services/PageService";
import { createAction, Action } from "redux-actions";
import { Dispatch } from "redux";
import { IState } from "store/interfaces/State";
import { PUBLICATIONS_LOADED, PAGE_LOADED } from "store/actions/Actions";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IPageService } from "services/interfaces/PageService";

export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);
export const pageLoaded = createAction(PAGE_LOADED, pageInfo => pageInfo);

export { Action };

/* if anybody know how to make it readble with ts? */
export const fetchPublications = (publicationService: IPublicationService, productFamily?: string): (dispatch: Dispatch<IState>) => void => (dispatch) => {
    publicationService.getPublications(productFamily)
        .then((publications): void => {
            dispatch(publicationsLoaded(publications));
        });
};

export const fetchPage = (pageService: IPageService, publicationId: string, pageId: string): (dispatch: Dispatch<IState>) => void => (dispatch) => {
    pageService.getPageInfo(publicationId, pageId).then((page) => {
        console.log("Page", page);
        dispatch(pageLoaded(page));
    });
};