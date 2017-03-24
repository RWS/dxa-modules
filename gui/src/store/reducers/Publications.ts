import { PUBLICATIONS_LOADED, PUBLICATIONS_LOADING } from "store/actions/Actions";
import { IPublication } from "interfaces/Publication";
import { handleAction, combineReducers, combine } from "./CombineReducers";
import { PUBLICATIONS_LOADING_ERROR } from "store/actions/Actions";
import { IPublicationsMap, IPublicationsState } from "store/interfaces/State";

const buildMap = (currentMap: IPublicationsMap, publications: IPublication[]) => Object.assign({}, currentMap, ...publications.map(publication => ({[publication.id]: publication})));

const notFound = (id: string) => ({
    id,
    title: ""
});

const byId = handleAction(
    PUBLICATIONS_LOADED,
    (state: IPublicationsMap, payload: IPublication[]): IPublicationsMap => buildMap(state, payload),
    {}
);

const isLoading = combine(
    handleAction(PUBLICATIONS_LOADING, () => true, false),
    handleAction(PUBLICATIONS_LOADED, () => false, false),
    handleAction(PUBLICATIONS_LOADING_ERROR, () => false, false)
);

const lastError = combine(
    handleAction(PUBLICATIONS_LOADING_ERROR, (message: string) => message, ""),
    handleAction(PUBLICATIONS_LOADED, () => "", "")
);

export const publications = combineReducers({
    byId,
    isLoading,
    lastError
});

// Selectors
export const getPubList = (state: IPublicationsState): IPublication[] => Object.values(state.byId);
export const getPubById = (state: IPublicationsState, id: string): IPublication => id in state.byId ? state.byId[id] : notFound(id);

export const getPubsByLang = (state: IPublicationsState, language: string) =>
    getPubList(state)
    .filter((publication: IPublication) => publication.language === language);

export const getPubByIdAndLang = (state: IPublicationsState, hostPubId: string, language: string) =>
    getPubList(state)
    .filter((publication: IPublication) => publication.versionRef === getPubById(state, hostPubId).versionRef)
    .find((publication: IPublication) => publication.language === language) || notFound(hostPubId);

export const isLoadnig = (state: IPublicationsState): boolean => state.isLoading;
export const getLastError = (state: IPublicationsState): string => state.lastError;