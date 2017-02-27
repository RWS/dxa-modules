import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { Promise } from "es6-promise";

/**
 * Publication related services
 */
export interface IPublicationService {

    /**
     * Get the list of publications
     *
     * @param {string} productFamily productFamily title
     * @returns {Promise<IPublication[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getPublications(productFamily?: string): Promise<IPublication[]>;

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
}
