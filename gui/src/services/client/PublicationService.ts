import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
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
     * @param {string} productFamily productFamily title
     * @returns {Promise<IPublication[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getPublications(productFamily?: string): Promise<IPublication[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getPublications(productFamily));
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getPublications(productFamily));
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
     * @param {boolean} reload if list should be reloaded
     * @returns {Promise<IProductFamily[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getProductFamilies(reload?: boolean): Promise<IProductFamily[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (publications?: IProductFamily[]) => void, reject: (error: string | null) => void) => {
            if (!reload && publication.isLoaded()) {
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
                publication.load(reload);
            }
        });
    }

    /**
     * Get the publication title
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<string>} Promise to return the title
     *
     * @memberOf DataStoreClient
     */
    public getPublicationTitle(publicationId: string): Promise<string> {
        return new Promise((resolve: (title?: string) => void, reject: (error: string | null) => void) => {
            this.getPublications().then(
                publications => {
                    if (Array.isArray(publications)) {
                        for (const pub of publications) {
                            if (pub.id === publicationId) {
                                resolve(pub.title);
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

    private getPublicationsModel(): Publications {
        if (!PublicationService.PublicationsModel) {
            PublicationService.PublicationsModel = new Publications();
        }
        return PublicationService.PublicationsModel;
    }

}
