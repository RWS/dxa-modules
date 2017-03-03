import { createAction, Action } from "redux-actions";

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const PUBLICATIONS_LOADED = "PUBLICATIONS_LOADED";

export const changeLanguage = createAction(CHANGE_LANGUAGE, language => language);
export const publicationsLoaded = createAction(PUBLICATIONS_LOADED, publications => publications);

export { Action }
