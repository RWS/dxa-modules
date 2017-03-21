import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
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
        productFamilies: IProductFamily[];
        productReleaseVersions: IProductReleaseVersion[];
    } = {
        error: null,
        publications: [],
        productFamilies: [],
        productReleaseVersions: []
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
     * @param {string} [productFamily] productFamily title
     * @param {string} [productReleaseVersion] product release version title
     * @returns {Promise<IPublication[]>} promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]> {
        const { error, publications } = this._mockDataPublications;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(publications);
        }
    }

    /**
     * Get the list of publications product families
     *
     * @returns {Promise<ProductFamily[]>} promise to return the items
     *
     * @memberOf DataStoreServer
     */
    public getProductFamilies(): Promise<IProductFamily[]> {
        const { error, productFamilies } = this._mockDataPublications;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(productFamilies);
        }
    }

    /**
     * Get the list of product release versions for a product ProductFamily
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} productFamily Product family
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf IPublicationService
     */
    public getProductReleaseVersions(productFamily: string): Promise<IProductReleaseVersion[]> {
        const { error, productReleaseVersions } = this._mockDataPublications;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(productReleaseVersions);
        }
    }

    /**
     * Get the list of product release versions for a publication
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf IPublicationService
     */
    public getProductReleaseVersionsByPublicationId(publicationId: string): Promise<IProductReleaseVersion[]> {
        const { error, productReleaseVersions } = this._mockDataPublications;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(productReleaseVersions);
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
