import { ISearchQuery, ISearchResult } from "interfaces/Search";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";

/**
 * Publications model
 *
 * @export
 * @class Publications
 * @extends {LoadableObject}
 */
export class Search extends LoadableObject {

    private _results: ISearchResult[];

    /**
     * Get search results
     *
     * @param {ISearchQuery} query search query
     * @returns {ISearchResults[]}
     */
    public getSeachResults(query?: ISearchQuery): ISearchResult[] {
        return this._results;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        Net.getRequest(
            Api.getSearchUrl(),
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed));

    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const res = JSON.parse(result);
        this._results = res;
        super._processLoadResult(result, webRequest);
    }
}
