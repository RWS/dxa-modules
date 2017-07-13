import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchQueryResults } from "interfaces/Search";
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
        children: ISearchQueryResults | undefined
    } = {
        error: null,
        children: undefined
    };

    /**
     * Get search results
     *
     * @param {query} query Search query
     * @returns {Promise<ISearchQueryResults>} Promise to return Results
     *
     * @memberOf DataStoreClient
     */
    public getSearchResults(query: ISearchQuery): Promise<ISearchQueryResults> {
        const { error, children } = this._mockDataToc;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(children);
        }
    }
}
