import { ISitemapItem, IPublication } from "../interfaces/ServerModels";
import { IPageInfo } from "../models/Page";
import { Promise } from "es6-promise";

/**
 * Data Store implementation
 */
export interface IDataStore {

    /**
     * Get the list of publications
     *
     * @returns {Promise<IPublication[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getPublications(): Promise<IPublication[]>;

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
     * @param {string} [parentId] The parent id
     * @returns {Promise<ISitemapItem[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getSitemapItems(publicationId: string, parentId?: string): Promise<ISitemapItem[]>;

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<IPageInfo>} Promise to return the the content
     *
     * @memberOf IDataStore
     */
    getPageInfo(publicationId: string, pageId: string): Promise<IPageInfo>;

    /**
     * Get the publication title
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<string>} Promise to return the title
     *
     * @memberOf IDataStore
     */
    getPublicationTitle(publicationId: string): Promise<string>;

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
