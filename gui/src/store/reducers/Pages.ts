import { combineReducers, handleAction, combine } from "./combineReducers";
import { PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";
import { IPage } from "interfaces/Page";

export interface IPagesMap {
    [id: string]: IPage;
};
export interface IPageErrosMap {
    [pageId: string]: string;
}

export interface IPageState {
    byId: IPagesMap;
}

const notFound = (id: string): IPage => ({
    id,
    title: "",
    content: "",
    sitemapIds: undefined
});

const removeByKey = (myObj: IPageErrosMap, deleteKey: string) => {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result: IPageErrosMap, current) => {
      result[current] = myObj[current];
      return result;
  }, {});
};

export const getPageById = (state: IPageState, id: string): IPage => id in state.byId ? state.byId[id] : notFound(id);

// const pageLoading = (id: string, page: IPage) => Object.assign({}, {

// });

const byId = handleAction(PAGE_LOADED,
        (state: IPageState, page: IPage): IPagesMap => Object.assign({}, state, { [page.id]: page})
        , {});

const loading = combine(
    handleAction(PAGE_LOADING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(PAGE_LOADED, (state: string[], page: IPage) => state.filter((id) => id !== page.id), [])
);

const errors = combine(
    handleAction(PAGE_ERROR, (state: IPageErrosMap, error) => Object.assign({}, state, { [error.id]: error.message}), {}),
    handleAction(PAGE_LOADING, (state: IPageErrosMap, pageId: string) => removeByKey(state, pageId), {})
);

export const pages = combineReducers({
    byId,
    loading,
    errors
});