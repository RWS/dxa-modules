import { ISitemapItem } from "../../interfaces/ServerModels";
import { Promise } from "es6-promise";

/**
 * Taxonomy related services
 */
export interface ITaxonomyService {

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ISitemapItem[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getSitemapRoot(publicationId: string): Promise<ISitemapItem[]>;

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent id
     * @returns {Promise<ISitemapItem[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getSitemapItems(publicationId: string, parentId: string): Promise<ISitemapItem[]>;

    /**
     * Get the full path for a sitemap item within a sitemap
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<ISitemapItem[]>} Promise to return the full path
     *
     * @memberOf IDataStore
     */
    getSitemapPath(publicationId: string, pageId: string): Promise<ISitemapItem[]>;
}
