import { IPublication } from "../../interfaces/ServerModels";
import { Promise } from "es6-promise";

/**
 * Publication related services
 */
export interface IPublicationService {

    /**
     * Get the list of publications
     *
     * @returns {Promise<IPublication[]>} Promise to return the items
     *
     * @memberOf IDataStore
     */
    getPublications(): Promise<IPublication[]>;

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
