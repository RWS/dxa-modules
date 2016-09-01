/// <reference path="../models/Page.ts" />
/// <reference path="../models/Publications.ts" />
/// <reference path="../models/Toc.ts" />
/// <reference path="../models/NavigationLinks.ts" />

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
         * @param {(error: string, publications?: IPublication[]) => void} callback Returns the items
         */
        public getPublications(callback: (error: string, publications?: IPublication[]) => void): void {
            const publication = this.getPublicationsModel();
            const onLoad = () => {
                publication.removeEventListener("load", onLoad);
                callback(null, publication.getPublications());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                publication.removeEventListener("loadfailed", onLoadFailed);
                callback(event.data.error);
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
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapRoot(callback: (error: string, children?: ISitemapItem[]) => void): void {
            this.getSitemapItems("root", callback);
        }

        /**
         * Get the site map items for a parent
         *
         * @param {string} parentId The parent id
         * @param {(error: string, children?: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapItems(parentId: string, callback: (error: string, children?: ISitemapItem[]) => void): void {
            const toc = this.getTocModel(parentId);
            const onLoad = () => {
                toc.removeEventListener("load", onLoad);
                callback(null, toc.getSitemapItems());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                toc.removeEventListener("loadfailed", onLoadFailed);
                callback(event.data.error);
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
         * @param {(error: string, info?: IPageInfo) => void} callback Returns the content
         */
        public getPageInfo(pageId: string, callback: (error: string, info?: IPageInfo) => void): void {
            const page = this.getPageModel(pageId);
            const onLoad = () => {
                page.removeEventListener("load", onLoad);
                callback(null, page.getPageInfo());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                page.removeEventListener("loadfailed", onLoadFailed);
                callback(event.data.error);
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
         * @param {(error: string, title?: string) => void} callback Returns the title
         */
        public getPublicationTitle(publicationId: string, callback: (error: string, title?: string) => void): void {
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
         * Get the full path for a page
         *
         * @param {string} pageId The page id
         * @param {(error: string, path?: string[]) => void} callback Returns the full path
         */
        public getPagePath(pageId: string, callback: (error: string, path?: string[]) => void): void {
            const navigationLinks = this.getNavigationLinksModel(pageId);
            const onLoad = () => {
                navigationLinks.removeEventListener("load", onLoad);
                const path = navigationLinks.getNavigationLinks().Items.map(item => item.Id);
                callback(null, path);
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                navigationLinks.removeEventListener("loadfailed", onLoadFailed);
                callback(event.data.error);
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
