import { ITaxonomyService } from "../interfaces/TaxonomyService";
import { ISitemapItem } from "../../interfaces/ServerModels";
import { Promise } from "es6-promise";

/**
 * Taxonomy service for the server.
 *
 * @export
 * @class TaxonomyService
 * @implements {ITaxonomyService}
 */
export class TaxonomyService implements ITaxonomyService {

    private _mockDataToc: {
        error: string | null;
        children: ISitemapItem[]
    } = {
        error: null,
        children: []
    };

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ISitemapItem[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapRoot(publicationId: string): Promise<ISitemapItem[]> {
        return this.getSitemapItems(publicationId);
    }

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} [parentId] The parent id
     * @returns {Promise<ISitemapItem[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapItems(publicationId: string, parentId?: string): Promise<ISitemapItem[]> {
        const { error, children } = this._mockDataToc;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(children);
        }
    }

    /**
     * Get the full path for a sitemap item within a sitemap
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<ISitemapItem[]>} Promise to return the full path
     *
     * @memberOf DataStoreServer
     */
    public getSitemapPath(publicationId: string, pageId: string): Promise<ISitemapItem[]> {
        return new Promise((resolve: (path?: ISitemapItem[]) => void, reject: (error: string | null) => void) => {
            //
        });
    }
}
