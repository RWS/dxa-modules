import { language } from "./Language";
import { publication } from "./Publication";
import { publications } from "./Publications";
import * as Publications from "./Publications";

import { IState, IPublicationCurrentState } from "store/interfaces/State";
// import { Publications as PublicationsBase } from "models/Publications";
import { IPublication } from "interfaces/Publication";
import { combineReducers } from "./combineReducers";

export const mainReducer = combineReducers({
    language,
    publication,
    publications
});


export const getPubList = (state: IState): IPublication[] => Publications.getPubList(state.publications);

export const getPubByLang = (state: IState, pubId: string, language: string): IPublication | null => Publications.getPubByLang(state.publications, pubId, language);

export const getCurrentPub = (state: IState): IPublicationCurrentState => state.publication;