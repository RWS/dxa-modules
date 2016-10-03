/// <reference path="../../models/Page.ts" />
/// <reference path="../../models/Publications.ts" />
/// <reference path="../../models/Toc.ts" />
/// <reference path="../../models/NavigationLinks.ts" />

module Sdl.DitaDelivery {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;
    import IPublication = Server.Models.IPublication;

    /**
     * Data store, interacts with the models to fetch the required data.
     *
     * @export
     * @class DataStore
     */
    export class DataStoreClient implements IDataStore {

        /**
         * Publications model
         *
         * @private
         * @static
         * @type {Models.Publications}
         */
        private static PublicationsModel: Models.Publications;

        /**
         * Table of content models
         *
         * @private
         * @static
         * @type {{ [parentId:string]: Models.Toc }}
         */
        private static TocModels: { [parentId: string]: Models.Toc };

        /**
         * Page models
         *
         * @private
         * @static
         * @type {{ [pageId:string]: Models.Page }}
         */
        private static PageModels: { [pageId: string]: Models.Page };

        /**
         * Navigation links models
         *
         * @private
         * @static
         * @type {{ [pageId: string]: Models.NavigationLinks }}
         */
        private static NavigationLinksModels: { [pageId: string]: Models.NavigationLinks };

        /**
         * Get the list of publications
         *
         * @param {(error: string | null, publications?: IPublication[]) => void} callback Returns the items
         */
        public getPublications(callback: (error: string | null, publications?: IPublication[]) => void): void {
            const publication = this.getPublicationsModel();
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                callback(null, publication.getPublications());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                removeEventListeners();
                callback(event.data.error);
            };
            removeEventListeners = (): void => {
                publication.removeEventListener("load", onLoad);
                publication.removeEventListener("loadfailed", onLoadFailed);
            };
            if (!publication.isLoaded()) {
                publication.addEventListener("load", onLoad);
                publication.addEventListener("loadfailed", onLoadFailed);
                publication.load();
            } else {
                callback(null, publication.getPublications());
            }
        }

        /**
         * Get the root objects of the sitemap
         *
         * @param {(error: string | null, items: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapRoot(callback: (error: string | null, items?: ISitemapItem[]) => void): void {
            this.getSitemapItems("root", callback);
        }

        /**
         * Get the site map items for a parent
         *
         * @param {string} parentId The parent id
         * @param {(error: string | null, items?: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapItems(parentId: string, callback: (error: string | null, items?: ISitemapItem[]) => void): void {
            const toc = this.getTocModel(parentId);
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                callback(null, toc.getSitemapItems());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                removeEventListeners();
                callback(event.data.error);
            };
            removeEventListeners = (): void => {
                toc.removeEventListener("load", onLoad);
                toc.removeEventListener("loadfailed", onLoadFailed);
            };
            if (!toc.isLoaded()) {
                toc.addEventListener("load", onLoad);
                toc.addEventListener("loadfailed", onLoadFailed);
                toc.load();
            } else {
                callback(null, toc.getSitemapItems());
            }
        }

        /**
         * Get page information
         *
         * @param {string} pageId The page id
         * @param {(error: string | null, info?: IPageInfo) => void} callback Returns the content
         */
        public getPageInfo(pageId: string, callback: (error: string | null, info?: IPageInfo) => void): void {
            const page = this.getPageModel(pageId);
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                callback(null, page.getPageInfo());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                removeEventListeners();
                callback(event.data.error);
            };
            removeEventListeners = (): void => {
                page.removeEventListener("load", onLoad);
                page.removeEventListener("loadfailed", onLoadFailed);
            };
            if (!page.isLoaded()) {
                page.addEventListener("load", onLoad);
                page.addEventListener("loadfailed", onLoadFailed);
                page.load();
            } else {
                callback(null, page.getPageInfo());
            }
        }

        /**
         * Get the publication title
         *
         * @param {string} publicationId Publication id
         * @param {(error: string | null, title?: string) => void} callback Returns the title
         */
        public getPublicationTitle(publicationId: string, callback: (error: string | null, title?: string) => void): void {
            this.getPublications((error, publications) => {
                if (error) {
                    callback(error);
                    return;
                }

                if (Array.isArray(publications)) {
                    for (const pub of (publications as IPublication[])) {
                        if (pub.Id === publicationId) {
                            callback(null, pub.Title);
                            return;
                        }
                    }
                }

                callback(Localization.formatMessage("datastore.publication.not.found", [publicationId]));
            });
        }

        /**
         * Get the full path for a sitemap item within a sitemap
         *
         * @param {string} sitemapItemId The id of the item in the sitemap
         * @param {(error: string | null, path?: string[]) => void} callback Returns the full path
         */
        public getSitemapPath(sitemapItemId: string, callback: (error: string | null, path?: string[]) => void): void {
            const navigationLinks = this.getNavigationLinksModel(sitemapItemId);
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                const path = navigationLinks.getNavigationLinks().Items.map(item => item.Id);
                callback(null, path);
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                removeEventListeners();
                callback(event.data.error);
            };
            removeEventListeners = (): void => {
                navigationLinks.removeEventListener("load", onLoad);
                navigationLinks.removeEventListener("loadfailed", onLoadFailed);
            };
            if (!navigationLinks.isLoaded()) {
                navigationLinks.addEventListener("load", onLoad);
                navigationLinks.addEventListener("loadfailed", onLoadFailed);
                navigationLinks.load();
            } else {
                const path = navigationLinks.getNavigationLinks().Items.map(item => item.Id);
                callback(null, path);
            }
        }

        private getTocModel(parentId: string): Models.Toc {
            if (!DataStoreClient.TocModels) {
                DataStoreClient.TocModels = {};
            }
            if (!DataStoreClient.TocModels[parentId]) {
                DataStoreClient.TocModels[parentId] = new Models.Toc(parentId);
            }
            return DataStoreClient.TocModels[parentId];
        }

        private getPageModel(pageId: string): Models.Page {
            if (!DataStoreClient.PageModels) {
                DataStoreClient.PageModels = {};
            }
            if (!DataStoreClient.PageModels[pageId]) {
                DataStoreClient.PageModels[pageId] = new Models.Page(pageId);
            }
            return DataStoreClient.PageModels[pageId];
        }

        private getPublicationsModel(): Models.Publications {
            if (!DataStoreClient.PublicationsModel) {
                DataStoreClient.PublicationsModel = new Models.Publications;
            }
            return DataStoreClient.PublicationsModel;
        }

        private getNavigationLinksModel(pageId: string): Models.NavigationLinks {
            if (!DataStoreClient.NavigationLinksModels) {
                DataStoreClient.NavigationLinksModels = {};
            }
            if (!DataStoreClient.NavigationLinksModels[pageId]) {
                DataStoreClient.NavigationLinksModels[pageId] = new Models.NavigationLinks(pageId);
            }
            return DataStoreClient.NavigationLinksModels[pageId];
        }

    }

}
