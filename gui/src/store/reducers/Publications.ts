import { PUBLICATIONS_LOADED, PUBLICATIONS_LOADING } from "store/actions/Actions";
import { IPublication } from "interfaces/Publication";
import { handleAction, combineReducers, combine } from "./CombineReducers";
import { PUBLICATIONS_LOADING_ERROR } from "store/actions/Actions";
import { IPublicationsMap, IPublicationsState } from "store/interfaces/State";
import Version from "utils/Version";

const buildMap = (currentMap: IPublicationsMap, publications: IPublication[]) => {
    return Object.assign({}, currentMap, ...publications.map(publication => ({[publication.id]: publication})));
};

export const notFound = (id: string): IPublication => ({
    id,
    title: "",
    logicalId: "",
    version: "",
    createdOn: new Date(2000, 1, 1)
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
const productReleaseVersionHack = (prop: string, obj: {}) => {
    if (prop !== "productReleaseVersion") {
         // tslint:disable-next-line:no-any
        return (obj as any)[prop];
    }
    // tslint:disable-next-line:no-any
    let version = Version.normalize((obj as any)[prop]);
    return version ? version : null;
};

/**
 * Returns lisf of publicaions that are in state.
 * You can filter list of publications that  you need for different usecases
 * Example: getPubList(state, {
 *  language: "en",
 *  productFamily: "Kupchino"
 *  "!id": "myId"
 * });
 * @param state
 * @param filter
 */
export const getPubList = (state: IPublicationsState, filter: {} = {}): IPublication[] => {
    const keys = Object.keys(filter);
    return Object.values(state.byId)
        .filter((publication) => {
            return keys.every(prop => {
                const propName = /^\!(.+)/.test(prop) ? RegExp.$1 : prop;
                if (propName in publication === false) {
                    console.warn(`There is not property ${prop} in`, publication);
                }

                const valueFilter = productReleaseVersionHack(propName, filter);
                const valueObj = productReleaseVersionHack(propName, publication);
                return propName === prop ? valueFilter === valueObj :  valueFilter !== valueObj;
            });
        });
};
export const getPubById = (state: IPublicationsState, id: string): IPublication => id in state.byId ? state.byId[id] : notFound(id);

export const getPubsByLang = (state: IPublicationsState, language: string) => getPubList(state, { language });

export const getPubByIdAndLang = (state: IPublicationsState, hostPubId: string, language: string) => {
    const currentVersionRef = getPubById(state, hostPubId).versionRef;
    return getPubList(state)
        .filter((publication: IPublication) => publication.versionRef === currentVersionRef)
        .find((publication: IPublication) => publication.language === language) || notFound(hostPubId);
};

export const isLoadnig = (state: IPublicationsState): boolean => state.isLoading;
export const getLastError = (state: IPublicationsState): string => state.lastError;
