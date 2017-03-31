import { combineReducers, handleAction, combine } from "./CombineReducers";
import { IPage } from "interfaces/Page";
import { dummyPage } from "utils/Page";
import { PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";
import { IPagesMap, IPageState, IPageErrorsMap } from "store/interfaces/State";

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
    handleAction(PAGE_LOADED, (state: string[], page: IPage) => state.filter((id) => id !== page.id), []),
    handleAction(PAGE_ERROR, (state: string[], error: IPageErrorsMap) => state.filter((id) => id !== error.pageId), [])
);

const errors = combine(
    handleAction(PAGE_ERROR, (state: IPageErrorsMap, error) => Object.assign({}, state, { [error.pageId]: error.message}), {}),
    handleAction(PAGE_LOADING, (state: IPageErrorsMap, pageId: string) => removeByKey(state, pageId), {})
);

export const pages = combineReducers({
    byId,
    loading,
    errors
});

// Selectors
export const getPageById = (state: IPageState, id: string): IPage => id in state.byId ? state.byId[id] : dummyPage(id);
export const getErrorMessage = (state: IPageState, id: string): string => id in state.errors ? state.errors[id] : "";
export const isPageLoading = (state: IPageState, id: string): boolean => state.loading.includes(id);