// import { handleActions } from "redux-actions";
import { PUBLICATIONS_LOADED } from "../actions/Actions";
import { IPublication } from "interfaces/Publication";
import { handleAction, combineReducers } from "./combineReducers";

export interface IPublicationsIdMap {
    [id: string]: IPublication;
};
export interface IPublicationsState {
    byId: IPublicationsIdMap;
};

const buildMap = (currentMap: IPublicationsIdMap, publications: IPublication[]) => Object.assign(currentMap, ...publications.map(publication => ({[publication.id]: publication})));


const byId = handleAction(PUBLICATIONS_LOADED, 
        (state: IPublicationsIdMap, payload: IPublication[], getState: () => any): IPublicationsIdMap => { debugger; return buildMap(state, payload)},
        {});

export const publications = combineReducers({
    byId
});

//selectors
export const getPubList = (state: IPublicationsState): IPublication[] => Object.values(state.byId);
export const getPubById = (state: IPublicationsState, id: string) => state.byId[id];

export const getPubByLang = (state: IPublicationsState, hostPubId: string, language: string) => getPubList(state)
     .filter((publication: IPublication) => publication.versionRef === getPubById(state, hostPubId).versionRef)
     .find((publication: IPublication) => publication.language === language) || null;