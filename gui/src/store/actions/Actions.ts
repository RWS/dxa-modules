import { createAction, Action } from "redux-actions";

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const PUBLICATIONS_LOADED = "PUBLICATIONS_LOADED";

export const PUBLICATION_ROUTE_CHANGED = "PUBLICATION_ROUTE_CHANGED";

export const changeLanguage = createAction(CHANGE_LANGUAGE, language => language);
export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);

export const publicationRouteChanged = createAction(PUBLICATION_ROUTE_CHANGED, publication => publication);

export const setPublication = createAction(PUBLICATION_ROUTE_CHANGED, publication => ({
    id: publication.publicationId,
    pageId: publication.pageId
}));

//==============
// Api
//=============
export const fetchPublications = (productFamily?: string) => {
};

export { Action }