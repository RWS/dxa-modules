import { language } from "./Language";
import { publication } from "./Publication";
import { publications } from "./Publications";
import * as Publications from "./Publications";
import { pages } from "./Pages";
import * as Pages from "./Pages";
import { IState, IPublicationCurrentState } from "store/interfaces/State";
// import { Publications as PublicationsBase } from "models/Publications";
import { IPublication } from "interfaces/Publication";
import { combineReducers } from "./combineReducers";
import { IPage } from "interfaces/Page";

export const mainReducer = combineReducers({
    language,
    publication,
    publications,
    pages
});

export const getPubList = (state: IState): IPublication[] => Publications.getPubList(state.publications);
export const getPubByLang = (state: IState, pubId: string, language: string): IPublication | null => Publications.getPubByLang(state.publications, pubId, language);

export const getCurrentPub = (state: IState): IPublicationCurrentState => state.publication;
export const getPubById = (state: IState, id: string): IPublication => Publications.getPubById(state.publications, id);
export const getPageById = (state: IState, id: string): IPage => Pages.getPageById(state.pages, id);
export const getPubsByLang = (state: IState, language: string): IPublication[] => Publications.getPubsByLang(state.publications, language);