import { IPublicationService } from "../interfaces/PublicationService";
import { IPublication } from "../../interfaces/ServerModels";
import { Promise } from "es6-promise";

/**
 * Publication Service for the server.
 *
 * @export
 * @class PublicationService
 * @implements {IPublicationService}
 */
export class PublicationService implements IPublicationService {

    private _mockDataPublications: {
        error: string | null;
        publications: IPublication[];
    } = {
        error: null,
        publications: []
    };

    private _mockDataPublication: {
        error: string | null,
        title: string | undefined
    } = {
        error: null,
        title: "MP330"
    };

    /**
     * Get the list of publications
     *
     * @returns {Promise<IPublication[]>} promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getPublications(): Promise<IPublication[]> {
        const { error, publications } = this._mockDataPublications;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(publications);
        }
    }

    /**
     * Get the publication title
     *
     * @param {string} publicationId
     * @returns {Promise<string>} promise to returns the title
     *
     * @memberOf DataStoreServer
     */
    public getPublicationTitle(publicationId: string): Promise<string> {
        const { error, title } = this._mockDataPublication;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(title);
        }
    }
}
