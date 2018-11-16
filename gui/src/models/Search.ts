/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { ISearchResults, ISearchResult, ISearchRequestQuery } from "interfaces/ServerModels";
import { ISearchQuery, ISearchQueryResult, ISearchQueryResults } from "interfaces/Search";
import { Api, API_REQUEST_TYPE_JSON } from "utils/Api";
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
        const query = this._query;
        Net.postRequest(
            Api.getSearchUrl(query.locale, query.startIndex, query.publicationId),
            JSON.stringify({
                PublicationId: Number(query.publicationId),
                Language: query.locale,
                SearchQuery: query.searchQuery,
                StartIndex: query.startIndex,
                Count: query.count
            } as ISearchRequestQuery),
            API_REQUEST_TYPE_JSON,
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const r = JSON.parse(result) as ISearchResults;
        this._results = {
            hits: r.Hits,
            startIndex: r.StartIndex,
            queryResults: r.QueryResults.map((item: ISearchResult) => {
                const modifiedDate = Date.parse(item.ModifiedDate || "");
                const parsedId = TcmId.parseId(item.Id.replace("_", ":"));
                return {
                    id: item.Id,
                    content: item.Content,
                    language: item.Locale,
                    lastModifiedDate: isNaN(modifiedDate) ? null : new Date(modifiedDate),
                    publicationId: item.PublicationId ? item.PublicationId.toString() : "",
                    publicationTitle: item.PublicationTitle,
                    pageId: parsedId && parsedId.itemId,
                    pageTitle: item.Meta["FTITLE.logical.value"],
                    productFamilyTitle: item.ProductFamilyName,
                    productReleaseVersionTitle: item.ProductReleaseName
                } as ISearchQueryResult;
            })
        } as ISearchQueryResults;
        super._processLoadResult(result, webRequest);
    }
}
