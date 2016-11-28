import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ISitemapItem } from "interfaces/ServerModels";
import { localization } from "services/client/LocalizationService";
import { Toc } from "models/Toc";
import { NavigationLinks } from "models/NavigationLinks";
import { Promise } from "es6-promise";

/**
 * Taxonomy service, interacts with the models to fetch the required data.
 *
 * @export
 * @class TaxonomyService
 * @implements {ITaxonomyService}
 */
export class TaxonomyService implements ITaxonomyService {

    /**
     * Table of content models
     *
     * @private
     * @static
     * @type {{ [publicationId: string]: { [parentId: string]: Toc } }}
     */
    private static TocModels: { [publicationId: string]: { [parentId: string]: Toc } };

    /**
     * Navigation links models
     *
     * @private
     * @static
     * @type {{ [publicationId: string]: { [pageId: string]: NavigationLinks } }}
     */
    private static NavigationLinksModels: { [publicationId: string]: { [pageId: string]: NavigationLinks } };

    /**
     * Get the root objects of the sitemap
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ISitemapItem[]>} Promise to return items
     *
     * @memberOf DataStoreClient
     */
    public getSitemapRoot(publicationId: string): Promise<ISitemapItem[]> {
        return this.getSitemapItems(publicationId, "root");
    }

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent Id
     * @returns {Promise<ISitemapItem[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getSitemapItems(publicationId: string, parentId: string): Promise<ISitemapItem[]> {
        const toc = this.getTocModel(publicationId, parentId);

        return new Promise((resolve: (items?: ISitemapItem[]) => void, reject: (error: string | null) => void) => {
            if (toc.isLoaded()) {
                resolve(toc.getSitemapItems());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(toc.getSitemapItems());
                };
                const onLoadFailed = (event: SDL.Client.Event.Event) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    toc.removeEventListener("load", onLoad);
                    toc.removeEventListener("loadfailed", onLoadFailed);
                };

                toc.addEventListener("load", onLoad);
                toc.addEventListener("loadfailed", onLoadFailed);
                toc.load();
            }
        });
    }

    /**
     * Get the full path for a sitemap item within a sitemap
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<ISitemapItem[]>} Promise to return the full path
     *
     * @memberOf DataStoreClient
     */
    public getSitemapPath(publicationId: string, pageId: string): Promise<ISitemapItem[]> {
        const navigationLinks = this.getNavigationLinksModel(publicationId, pageId);
        if (!navigationLinks) {
            return Promise.reject(localization.formatMessage("error.path.not.found", [pageId, publicationId]));
        }

        return new Promise((resolve: (path?: ISitemapItem[]) => void, reject: (error: string | null) => void) => {
            if (navigationLinks.isLoaded()) {
                const path = navigationLinks.getPath();
                resolve(path);
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    const path = navigationLinks.getPath();
                    resolve(path);
                };
                const onLoadFailed = (event: SDL.Client.Event.Event) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    navigationLinks.removeEventListener("load", onLoad);
                    navigationLinks.removeEventListener("loadfailed", onLoadFailed);
                };

                navigationLinks.addEventListener("load", onLoad);
                navigationLinks.addEventListener("loadfailed", onLoadFailed);
                navigationLinks.load();
            }
        });
    }

    private getTocModel(publicationId: string, parentId: string): Toc {
        if (!TaxonomyService.TocModels) {
            TaxonomyService.TocModels = {};
        }
        if (!TaxonomyService.TocModels[publicationId]) {
            TaxonomyService.TocModels[publicationId] = {};
        }
        if (!TaxonomyService.TocModels[publicationId][parentId]) {
            TaxonomyService.TocModels[publicationId][parentId] = new Toc(publicationId, parentId);
        }
        return TaxonomyService.TocModels[publicationId][parentId];
    }

    private getNavigationLinksModel(publicationId: string, pageId: string): NavigationLinks | undefined {
        if (!TaxonomyService.NavigationLinksModels) {
            TaxonomyService.NavigationLinksModels = {};
        }
        if (!TaxonomyService.NavigationLinksModels[publicationId]) {
            TaxonomyService.NavigationLinksModels[publicationId] = {};
        }
        if (!TaxonomyService.NavigationLinksModels[publicationId][pageId]) {
            // TODO: this conversion will not be needed when upgrading to DXA 1.7
            // https://jira.sdl.com/browse/TSI-2131
            const taxonomyId = TcmId.getTaxonomyItemId("1", pageId);
            TaxonomyService.NavigationLinksModels[publicationId][pageId] = new NavigationLinks(publicationId, taxonomyId || pageId);
        }
        return TaxonomyService.NavigationLinksModels[publicationId][pageId];
    }

}
