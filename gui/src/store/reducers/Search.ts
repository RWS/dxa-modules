import { ISearchResult } from "interfaces/Search";
import { SEARCH_LOADED, SEARCH_LOADING, SEARCH_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "./CombineReducers";
import { ISearchPayload, ISearchResultsError, ISearchResults } from "store/interfaces/Search";

export interface ISearchResultsErrorPayload {
    queryKey: string;
    error: ISearchResultsError;
};

const bySearchQuery = combine(
    handleAction(SEARCH_LOADED, (state, { results, queryKey }) => {
        return ({ ...state, [queryKey]: results });
    }, {})
);

const loading = combine(
    handleAction(SEARCH_LOADING, (state: string[], queryKey: string) => [...state, queryKey], []),
    handleAction(SEARCH_LOADED, (state: string[], { queryKey }: ISearchPayload) => state.filter((id) => id !== queryKey), []),
    handleAction(SEARCH_ERROR, (state: string[], { queryKey, error }: ISearchResultsErrorPayload) => state.filter((id) => id !== queryKey), [])
);

const errors = handleAction(SEARCH_ERROR, () => [], []);

export const results = combineReducers({
    bySearchQuery,
    loading,
    errors
});

export const getBySearchQueryKey = (state: ISearchResults, searchQueryKey: string) =>
    searchQueryKey in state.bySearchQuery
        ? state.bySearchQuery[searchQueryKey]
        : ([] as ISearchResult[]);

export const getSearchErrorMessage = (state: ISearchResults, searchQueryKey: string): string =>
    searchQueryKey in state.errors
        ? state.errors[searchQueryKey]
        : "";

export const isSearchLoading = (state: ISearchResults, searchQueryKey: string): boolean => state.loading.includes(searchQueryKey);
