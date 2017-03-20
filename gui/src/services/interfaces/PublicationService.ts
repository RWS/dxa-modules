import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { Promise } from "es6-promise";

/**
 * Publication related services
 */
export interface IPublicationService {

    /**
     * Get the list of publications
     *
     * @param {string} [productFamily] productFamily title
     * @param {string} [productReleaseVersion] product release version title
     * @returns {Promise<IPublication[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]>;

    /**
     * Get the list of publications product families
     *
     * @returns {Promise<IProductFamily[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    getProductFamilies(): Promise<IProductFamily[]>;

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
     * Get the list of product release versions for a product ProductFamily
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} productFamily Product family
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf IPublicationService
     */
    getProductReleaseVersions(productFamily: string): Promise<IProductReleaseVersion[]>;
}
