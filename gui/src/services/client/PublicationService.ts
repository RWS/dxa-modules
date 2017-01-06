import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { localization } from "services/client/LocalizationService";
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
     * @returns {Promise<IPublication[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getPublications(): Promise<IPublication[]> {
        const publication = this.getPublicationsModel();
        return new Promise((resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
            if (publication.isLoaded()) {
                resolve(publication.getPublications());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(publication.getPublications());
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
