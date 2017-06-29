import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchResult } from "interfaces/Search";
import { Promise } from "es6-promise";

/**
 * Search service for the server.
 *
 * @export
 * @class SearchService
 * @implements {ISearchService}
 */
export class SearchService implements ISearchService {

    private _mockDataToc: {
        error: string | null;
        children: ISearchResult[]
    } = {
        error: null,
        children: []
    };

    /**
     * Get search results
     *
     * @param {query} query Search query
     * @returns {Promise<ISearchResult[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getSearchResults(query: ISearchQuery): Promise<ISearchResult[]> {
        const { error, children } = this._mockDataToc;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(children);
        }
    }
}
