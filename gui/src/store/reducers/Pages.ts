import { combineReducers, handleAction } from "./combineReducers";
import { PAGE_LOADED } from "store/actions/Actions";
import { IPage } from "interfaces/Page";

export interface IPagesMap {
    [id: string]: IPage;
};

export interface IPageState {
    byId: IPagesMap;
}

const notFound = (id: string): IPage => ({
    id,
    title: "",
    content: "",
    sitemapIds: undefined
});

const byId = handleAction(PAGE_LOADED,
        (state: IPagesMap, page: IPage): IPagesMap => {
            return Object.assign({}, state, { [page.id]: page });
        }
        , {});

export const pages = combineReducers({
    byId
});

export const getPageById = (state: IPageState, id: string): IPage => id in state.byId ? state.byId[id] : notFound(id);