import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchResult } from "interfaces/Search";

import { Search } from "models/Search";
import { Promise } from "es6-promise";

/**
 * Search service, interacts with the models to fetch the required data.
 *
 * @export
 * @class SearchService
 * @implements {ISearchService}
 */
export class SearchService implements ISearchService {

    /**
     * Search model
     *
     * @private
     * @static
     * @type {Search}
     */
    protected static SearchModel: Search | undefined;

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent Id
     * @returns {Promise<ISearchResult[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getSearchResults(query: ISearchQuery): Promise<ISearchResult[]> {
        const search = this.getSearchModel();

        return new Promise((resolve: (items?: ISearchResult[]) => void, reject: (error: string | null) => void) => {
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                resolve(search.getSeachResults());
            };
            const onLoadFailed = (event: Event & { data: { error: string } }) => {
                removeEventListeners();
                reject(event.data.error);
            };
            removeEventListeners = (): void => {
                search.removeEventListener("load", onLoad);
                search.removeEventListener("loadfailed", onLoadFailed);
            };

            search.addEventListener("load", onLoad);
            search.addEventListener("loadfailed", onLoadFailed);
            search.load();
        });
    }

    protected getSearchModel(): Search {
        if (!SearchService.SearchModel) {
            SearchService.SearchModel = new Search();
        }
        return SearchService.SearchModel;
    }
}
