import { PUBLICATIONS_LOADED } from "../actions/Actions";
import { IPublication } from "interfaces/Publication";
import { handleAction, combineReducers } from "./combineReducers";

export interface IPublicationsIdMap {
    [id: string]: IPublication;
};
export interface IPublicationsState {
    byId: IPublicationsIdMap;
};

const buildMap = (currentMap: IPublicationsIdMap, publications: IPublication[]) => Object.assign({}, ...publications.map(publication => ({[publication.id]: publication})));

const notFound = (id: string) => ({
    id,
    title: ""
});

const byId = handleAction(PUBLICATIONS_LOADED,
    (state: IPublicationsIdMap, payload: IPublication[]): IPublicationsIdMap => buildMap(state, payload),
    {});

export const publications = combineReducers({
    byId
});

//selectors
export const getPubList = (state: IPublicationsState): IPublication[] => Object.values(state.byId);
export const getPubById = (state: IPublicationsState, id: string): IPublication => id in state.byId ? state.byId[id] : notFound(id);

export const getPubsByLang = (state: IPublicationsState, language: string) => getPubList(state)
     .filter((publication: IPublication) => publication.language === language);

export const getPubByLang = (state: IPublicationsState, hostPubId: string, language: string) => getPubList(state)
     .filter((publication: IPublication) => publication.versionRef === getPubById(state, hostPubId).versionRef)
     .find((publication: IPublication) => publication.language === language) || null;
