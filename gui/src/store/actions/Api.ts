// import { PageService } from "test/mocks/services/PageService";
import { createAction, Action } from "redux-actions";
import { PublicationService } from "services/client/PublicationService";
import { Dispatch } from "redux";
import { IState } from "store/interfaces/State";
import { PUBLICATIONS_LOADED } from "store/actions/Actions";

// const apiPage = new PageService();
const publicationService = new PublicationService();

export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);

export { Action };

/* if anybody know how to make it readble with ts? */
export const fetchPublications = (productFamily?: string): (dispatch: Dispatch<IState>) => void => (dispatch) => {
    publicationService.getPublications(productFamily)
        .then((publications): void => {
            dispatch(publicationsLoaded(publications));
        });
};