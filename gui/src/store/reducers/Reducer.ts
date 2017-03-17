import * as Language from "./Language";
import * as Pages from "./Pages";
import * as Publication from "./Publication";
import * as Publications from "./Publications";
import { IState, IPublicationCurrentState } from "store/interfaces/State";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { combineReducers } from "./CombineReducers";

export const mainReducer = combineReducers({
    language: Language.language,
    pages: Pages.pages,
    publication: Publication.publication,
    publications: Publications.publications
});

// Publications selectors
export const getPubList = (state: IState): IPublication[] => Publications.getPubList(state.publications);
export const getPubById = (state: IState, id: string): IPublication => Publications.getPubById(state.publications, id);
export const getPubsByLang = (state: IState, language: string): IPublication[] => Publications.getPubsByLang(state.publications, language);
export const getPubByIdAndLang = (state: IState, pubId: string, language: string): IPublication | null => Publications.getPubByIdAndLang(state.publications, pubId, language);

// Pages selectors
export const getPageById = (state: IState, pageId: string): IPage => Pages.getPageById(state.pages, pageId);
export const getPageError = (state: IState, pageId: string): string => Pages.getPageError(state.pages, pageId);
export const isPageLoading = (state: IState, pageId: string): boolean => Pages.isPageLoading(state.pages, pageId);

// State selectors
export const getCurrentPub = (state: IState): IPublicationCurrentState => state.publication;
