import { ISearchResult } from "interfaces/Search";

export interface ISearchPayload {
    queryKey: string;
    results: ISearchResult[];
}

export interface ISearchResultsError {
    message: string;
}

export interface ISearchResults {
    bySearchQuery: { [queryKey: string]: ISearchResult[]};
    loading: string[];
    errors: { [queryKey: string]: string };
}
