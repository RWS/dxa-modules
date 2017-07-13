import { ISearchResults, ISearchResult } from "interfaces/ServerModels";
import { ISearchQuery, ISearchQueryResult, ISearchQueryResults } from "interfaces/Search";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { TcmId } from "utils/TcmId";

/**
 * Search model
 *
 * @export
 * @class Search
 * @extends {LoadableObject}
 */
export class Search extends LoadableObject {

    private _results: ISearchQueryResults;
    private _query: ISearchQuery;

    /**
     * Creates an instance of Search.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     */
    constructor(query: ISearchQuery) {
        super();
        this._query = query;
    }

    /**
     * Get search results
     *
     * @param {ISearchQuery} query search query
     * @returns {ISearchQueryResults}
     */
    public getSeachResults(query?: ISearchQuery): ISearchQueryResults {
        return this._results;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        Net.postRequest(
            Api.getSearchUrl(),
            JSON.stringify(this._query),
            "application/json",
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const r = JSON.parse(result) as ISearchResults;
        this._results = {
            hits: r.Hits,
            queryResults: r.QueryResults.map((item: ISearchResult) => {
                return {
                    id: item.Id,
                    content: item.Content,
                    language: item.Locale,
                    lastModifiedDate: item.ModifiedDate,
                    publicationId: item.PublicationId,
                    publicationTitle: item.PublicationTitle,
                    pageId: TcmId.getItemIdFromTaxonomyItemId(item.Id),
                    pageTitle: item.PageTitle,
                    productFamilyTitle: item.ProductFamilyName,
                    productReleaseVersionTitle: item.ProductReleaseName
                } as ISearchQueryResult;
            })
        } as ISearchQueryResults;
        super._processLoadResult(result, webRequest);
    }
}
