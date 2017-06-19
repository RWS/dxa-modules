import { ITaxonomyService } from "services/interfaces/TaxonomyService";
import { ITaxonomy } from "interfaces/Taxonomy";
import { localization } from "services/common/LocalizationService";
import { Toc } from "models/Toc";
import { NavigationLinks } from "models/NavigationLinks";
import { Promise } from "es6-promise";
import { TcmId } from "utils/TcmId";
import { TaxonomyItemId } from "interfaces/TcmId";
import { IConditionMap } from "store/interfaces/Conditions";
import { getStore } from "store/Store";
import { getLastConditions } from "store/reducers/Reducer";
import { MD5 } from "object-hash";

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
     * @protected
     * @static
     * @type {{ [publicationId: string]: { [parentId: string]: Toc } }}
     */
    protected TocModels: { [key: string]: Toc } = {};

    /**
     * Navigation links models
     *
     * @protected
     * @static
     * @type {{ [publicationId: string]: { [pageId: string]: NavigationLinks } }}
     */
    protected NavigationLinksModels: { [key: string]: NavigationLinks } = {};

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
     * @param {string} pageId Page id
     * @param {string} taxonomyId The taxonomy id (eg t1-k5)
     * @returns {Promise<ITaxonomy[]>} Promise to return the full path
     *
     * @memberOf DataStoreClient
     */
    public getSitemapPath(publicationId: string, pageId: string, taxonomyId: string): Promise<ITaxonomy[]> {
        const navigationLinks = this.getNavigationLinksModel(publicationId, pageId, taxonomyId);
        if (!navigationLinks) {
            return Promise.reject(localization.formatMessage("error.path.not.found", [taxonomyId, publicationId]));
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
                    // Enhance toc models to include full path and child items
                    const pathWithSiblings = navigationLinks.getPathWithSiblings();
                    for (const level of pathWithSiblings) {
                        this.addTocModel(publicationId, level.parentId, level.items);
                    }
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

    //Hack while taxonomy data is not moved to redux state
    private _getConditions(publicationId: string): IConditionMap {
        return getLastConditions(getStore().getState(), publicationId);
    }

    private _getKey(publicationId: string, ...rest: string[]): string {
        return [publicationId, ...rest, MD5(this._getConditions(publicationId))].join("/");
    }

    private getTocModel(publicationId: string, parentId: string): Toc {
        return this.get(publicationId, parentId) ||
            this.keep(publicationId, parentId, new Toc(publicationId, parentId, this._getConditions(publicationId)));
    }

    private addTocModel(publicationId: string, parentId: string, items: ITaxonomy[]): Toc {
        const toc = new Toc(publicationId, parentId, this._getConditions(publicationId), items);
        this.keep(publicationId, parentId, toc);
        return toc;
    }

    private get(publicationId: string, parentId: string): Toc | undefined {
        const key = this._getKey(publicationId, parentId);
        return this.TocModels[key];
    }

    private keep(publicationId: string, parentId: string, toc: Toc): Toc {
        const key = this._getKey(publicationId, parentId);
        this.TocModels[key] = toc;
        return toc;
    }

    private getNavigationLinksModel(publicationId: string, pageId: string, taxonomyId: string): NavigationLinks | undefined {
        const key = this._getKey(publicationId, pageId, taxonomyId);
        if (!this.NavigationLinksModels[key]) {
            this.NavigationLinksModels[key] = new NavigationLinks(publicationId, pageId, taxonomyId, this._getConditions(publicationId));
        }
        return this.NavigationLinksModels[key];
    }

}
