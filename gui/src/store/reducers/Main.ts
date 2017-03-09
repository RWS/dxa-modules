import { languageReducer as language } from "./Language";
import { publicationReducer as publication } from "./Publication";
import { combineReducers, Action } from "redux";

export const mainReducer = combineReducers({
    language,
    publication
});

export { Action }