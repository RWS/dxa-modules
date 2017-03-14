import { createAction, Action } from "redux-actions";

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const PUBLICATIONS_LOADED = "PUBLICATIONS_LOADED";

export const PAGE_LOADED = "PAGE_LOADED";
export const PAGE_LOADING = "PAGE_LOADING";
export const PAGE_ERROR = "PAGE_ERROR";

export const PUBLICATION_ROUTE_CHANGED = "PUBLICATION_ROUTE_CHANGED";

export const changeLanguage = createAction(CHANGE_LANGUAGE, language => language);
export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);

export const publicationRouteChanged = createAction(PUBLICATION_ROUTE_CHANGED, publication => ({
    publicationId: publication.publicationId,
    pageId: publication.pageId
}));

export const setPublication = publicationRouteChanged;

//==============
// Api
//=============

export { Action }