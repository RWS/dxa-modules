import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ITaxonomy } from "interfaces/Taxonomy";
import { localization } from "services/common/LocalizationService";
import { Toc } from "models/Toc";
import { NavigationLinks } from "models/NavigationLinks";
import { Promise } from "es6-promise";
import { TcmId } from "utils/TcmId";
import { TaxonomyItemId } from "interfaces/TcmId";

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
     * @returns {Promise<ITaxonomy[]>} Promise to return items
     *
     * @memberOf DataStoreClient
     */
    public getSitemapRoot(publicationId: string): Promise<ITaxonomy[]> {
        const taxonomyItemId = TcmId.getTaxonomyItemId(TaxonomyItemId.Toc);
        return this.getSitemapItems(publicationId, taxonomyItemId || "");
    }

    /**
     * Get the site map items for a parent
     *
     * @param {string} publicationId Publication Id
     * @param {string} parentId The parent Id
     * @returns {Promise<ITaxonomy[]>} Promise to return Items
     *
     * @memberOf DataStoreClient
     */
    public getSitemapItems(publicationId: string, parentId: string): Promise<ITaxonomy[]> {
        const toc = this.getTocModel(publicationId, parentId);

        return new Promise((resolve: (items?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
            if (toc.isLoaded()) {
                resolve(toc.getSitemapItems());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(toc.getSitemapItems());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
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
     * @param {string} sitemapId The sitemap id
     * @returns {Promise<ITaxonomy[]>} Promise to return the full path
     *
     * @memberOf DataStoreClient
     */
    public getSitemapPath(publicationId: string, sitemapId: string): Promise<ITaxonomy[]> {
        const navigationLinks = this.getNavigationLinksModel(publicationId, sitemapId);
        if (!navigationLinks) {
            return Promise.reject(localization.formatMessage("error.path.not.found", [sitemapId, publicationId]));
        }

        return new Promise((resolve: (path?: ITaxonomy[]) => void, reject: (error: string | null) => void) => {
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
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
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
            const taxonomyId = TcmId.getTaxonomyItemId(TaxonomyItemId.Toc, pageId);
            TaxonomyService.NavigationLinksModels[publicationId][pageId] = new NavigationLinks(publicationId, taxonomyId || pageId);
        }
        return TaxonomyService.NavigationLinksModels[publicationId][pageId];
    }

}
