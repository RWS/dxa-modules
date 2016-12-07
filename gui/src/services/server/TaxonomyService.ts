import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ITaxonomy } from "interfaces/Taxonomy";
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
        children: ITaxonomy[]
    } = {
        error: null,
        children: []
    };

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapRoot(publicationId: string): Promise<ITaxonomy[]> {
        return this.getSitemapItems(publicationId, "root");
    }

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getSitemapItems(publicationId: string, parentId: string): Promise<ITaxonomy[]> {
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
     * @returns {Promise<ITaxonomy[]>} Promise to return the full path
     *
     * @memberOf DataStoreServer
     */
    public getSitemapPath(publicationId: string, pageId: string): Promise<ITaxonomy[]> {
        return new Promise((resolve: (path?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
            //
        });
    }
}
