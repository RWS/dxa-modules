import { ITaxonomy } from "interfaces/Taxonomy";
import { Promise } from "es6-promise";

/**
 * Taxonomy related services
 */
export interface ITaxonomyService {

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getSitemapRoot(publicationId: string): Promise<ITaxonomy[]>;

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent id
     * @returns {Promise<ITaxonomy[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getSitemapItems(publicationId: string, parentId: string): Promise<ITaxonomy[]>;

    /**
     * Get the full path for a sitemap item within a sitemap
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId Page id
     * @param {string} taxonomyId The taxonomy id (eg t1-k5)
     * @returns {Promise<ITaxonomy[]>} Promise to return the full path
     *
     * @memberOf IDataStore
     */
    getSitemapPath(publicationId: string, pageId: string, taxonomyId: string): Promise<ITaxonomy[]>;
}
