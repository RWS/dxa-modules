import { createAction, Action } from "redux-actions";

export { Action }

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const PAGE_ERROR = "PAGE_ERROR";
export const PAGE_LOADED = "PAGE_LOADED";
export const PAGE_LOADING = "PAGE_LOADING";

export const UPDATE_CURRENT_PUBLICATION = "UPDATE_CURRENT_PUBLICATION";
export const PUBLICATIONS_LOADED = "PUBLICATIONS_LOADED";
export const PUBLICATIONS_LOADING = "PUBLICATIONS_LOADING";
export const PUBLICATIONS_LOADING_ERROR = "PUBLICATIONS_LOADING_ERROR";
export const RELEASE_VERSIONS_LOADING = "RELEASE_VERSIONS_LOADING";
export const RELEASE_VERSIONS_LOADED = "RELEASE_VERSIONS_LOADED";
export const PRODUCT_FAMILY_LOADING = "PRODUCT_FAMILY_LOADING";
export const PRODUCT_FAMILY_LOADED = "PRODUCT_FAMILY_LOADED";

export const changeLanguage = createAction(CHANGE_LANGUAGE, language => language);
export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);
export const updateCurrentPublication = createAction(UPDATE_CURRENT_PUBLICATION,
    (publicationId: string, pageId: string = "", anchor: string = "") => ({ publicationId, pageId, anchor }));