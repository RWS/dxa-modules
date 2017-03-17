import { combineReducers, handleAction, combine } from "./CombineReducers";
import { PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";
import { IPage } from "interfaces/Page";

export interface IPagesMap {
    [id: string]: IPage;
};

export interface IPageErrorsMap {
    [pageId: string]: string;
}

export interface IPageState {
    byId: IPagesMap;
    errors: IPageErrorsMap;
    loading: string[];
}

const notFound = (id: string): IPage => ({
    id,
    title: "",
    content: "",
    sitemapIds: undefined
});

const removeByKey = (myObj: IPageErrorsMap, deleteKey: string) => {
    return Object.keys(myObj)
        .filter(key => key !== deleteKey)
        .reduce((result: IPageErrorsMap, current) => {
          result[current] = myObj[current];
          return result;
    }, {});
};

const byId = handleAction(
    PAGE_LOADED,
    (state: IPageState, page: IPage): IPagesMap => Object.assign({}, state, { [page.id]: page }),
    {}
);

const loading = combine(
    handleAction(PAGE_LOADING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(PAGE_LOADED, (state: string[], page: IPage) => state.filter((id) => id !== page.id), [])
);

const errors = combine(
    handleAction(PAGE_ERROR, (state: IPageErrorsMap, error) => Object.assign({}, state, { [error.id]: error.message}), {}),
    handleAction(PAGE_LOADING, (state: IPageErrorsMap, pageId: string) => removeByKey(state, pageId), {})
);

export const pages = combineReducers({
    byId,
    loading,
    errors
});

// Selectors
export const getPageById = (state: IPageState, id: string): IPage => id in state.byId ? state.byId[id] : notFound(id);
export const getPageError = (state: IPageState, id: string): string => {
    const { errors } = state;
    return (id in errors) ? errors[id] : errors.undefined || "";
};
export const isPageLoading = (state: IPageState, id: string): boolean => state.loading.includes(id);
