import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IProductFamily } from "interfaces/ProductFamily";
import { localization } from "services/common/LocalizationService";
import { Publications } from "models/Publications";
import { Promise } from "es6-promise";

/**
 * Publication service, interacts with the models to fetch the required data.
 *
 * @export
 * @class PublicationService
 * @implements {IPublicationService}
 */
export class PublicationService implements IPublicationService {

    /**
     * Publications model
     *
     * @private
     * @static
     * @type {Publications}
     */
    private static PublicationsModel: Publications;

    /**
     * Get the list of publications
     *
     * @param {string} [productFamily] productFamily title
     * @param {string} [productReleaseVersion] product release version title
     * @returns {Promise<IPublication[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (publications: IPublication[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getPublications(productFamily, productReleaseVersion));
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getPublications(productFamily, productReleaseVersion));
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    publication.removeEventListener("load", onLoad);
                    publication.removeEventListener("loadfailed", onLoadFailed);
                };

                publication.addEventListener("load", onLoad);
                publication.addEventListener("loadfailed", onLoadFailed);
                publication.load();
            }
        });
    }

    /**
     * Get the list of publications product families
     *
     * @returns {Promise<IProductFamily[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getProductFamilies(): Promise<IProductFamily[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (productFamilies: IProductFamily[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getProductFamilies());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getProductFamilies());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    publication.removeEventListener("load", onLoad);
                    publication.removeEventListener("loadfailed", onLoadFailed);
                };

                publication.addEventListener("load", onLoad);
                publication.addEventListener("loadfailed", onLoadFailed);
                publication.load();
            }
        });
    }

    /**
     * Get the publication by id
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IPublication>} Promise to return the publication
     *
     * @memberOf PublicationService
     */
    public getPublicationById(publicationId: string): Promise<IPublication> {
        return new Promise((resolve: (pub?: IPublication) => void, reject: (error: string | null) => void) => {
            this.getPublications().then(
                publications => {
                    if (Array.isArray(publications)) {
                        for (const pub of publications) {
                            if (pub.id === publicationId) {
                                resolve(pub);
                                return;
                            }
                        }
                    }

                    reject(localization.formatMessage("error.publication.not.found", [publicationId]));
                },
                error => {
                    reject(error);
                });
        });
    }

    /**
     * Get the list of product release versions for a product ProductFamily
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} productFamily Product family
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf PublicationService
     */
    public getProductReleaseVersions(productFamily: string): Promise<IProductReleaseVersion[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (productReleaseVersions?: IProductReleaseVersion[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getProductReleaseVersions(productFamily));
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getProductReleaseVersions(productFamily));
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    publication.removeEventListener("load", onLoad);
                    publication.removeEventListener("loadfailed", onLoadFailed);
                };

                publication.addEventListener("load", onLoad);
                publication.addEventListener("loadfailed", onLoadFailed);
                publication.load();
            }
        });
    }

    /**
     * Get the list of product release versions for a publication
     * Are sorted by release time (latest to oldest)
     *
     * @param {string} publicationId Publication id
     * @returns {Promise<IProductReleaseVersion[]>} Promise to return the product release versions
     *
     * @memberOf PublicationService
     */
    public getProductReleaseVersionsByPublicationId(publicationId: string): Promise<IProductReleaseVersion[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (productReleaseVersions?: IProductReleaseVersion[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getProductReleaseVersionsByPublicationId(publicationId));
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getProductReleaseVersionsByPublicationId(publicationId));
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    publication.removeEventListener("load", onLoad);
                    publication.removeEventListener("loadfailed", onLoadFailed);
                };

                publication.addEventListener("load", onLoad);
                publication.addEventListener("loadfailed", onLoadFailed);
                publication.load();
            }
        });
    }

    private getPublicationsModel(): Publications {
        if (!PublicationService.PublicationsModel) {
            PublicationService.PublicationsModel = new Publications();
        }
        return PublicationService.PublicationsModel;
    }

}
