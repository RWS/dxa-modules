import { ISearchResult as IServerSearchResult } from "interfaces/ServerModels";
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
        this._results = (JSON.parse(result) as IServerSearchResult[]).map((item: IServerSearchResult) => {
            return {
                id: item.Id,
                content: item.Content,
                language: item.Locale,
                //lastModifiedDate: new Date(item.Fields["MODIFIED-ON.lng.value"]),
                //publicationTitle : item.Fields["publicationtitle.generated.value"],
                lastModifiedDate: new Date("2016-05-27T08:08:10Z"),
                publicationTitle: "Publication MP330",

                /* TMP value */
                pageTitle: "-pageTitle-",
                productFamilyTitle: "-productFamilyTitle-",
                productReleaseVersionTitle: "-productReleaseVersionTitle-"
            } as ISearchResult;
        });
        super._processLoadResult(result, webRequest);
    }
}
