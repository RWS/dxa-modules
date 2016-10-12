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
                    const onLoadFailed = (event: SDL.Client.Event.Event) => {
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
         * Get the root objects of the sitemap
         *
         * @returns {Promise<ISitemapItem[]>} Promise to return items
         *
         * @memberOf DataStoreClient
         */
        public getSitemapRoot(): Promise<ISitemapItem[]> {
            return this.getSitemapItems("root");
        }

        /**
         * Get the site map items for a parent
         *
         * @param {string} parentId The parent Id
         * @returns {Promise<ISitemapItem[]>} Promise to return Items
         *
         * @memberOf DataStoreClient
         */
        public getSitemapItems(parentId: string): Promise<ISitemapItem[]> {
            const toc = this.getTocModel(parentId);

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
         * Get page information
         *
         * @param {string} pageId The page Id
         * @returns {Promise<IPageInfo>} Promise to return the content
         *
         * @memberOf DataStoreClient
         */
        public getPageInfo(pageId: string): Promise<IPageInfo> {
            const page = this.getPageModel(pageId);
            return new Promise((resolve: (info?: IPageInfo) => void, reject: (error: string | null) => void) => {
                if (page.isLoaded()) {
                    resolve(page.getPageInfo());
                } else {
                    let removeEventListeners: () => void;
                    const onLoad = () => {
                        removeEventListeners();
                        resolve(page.getPageInfo());
                    };
                    const onLoadFailed = (event: SDL.Client.Event.Event) => {
                        removeEventListeners();
                        reject(event.data.error);
                    };
                    removeEventListeners = (): void => {
                        page.removeEventListener("load", onLoad);
                        page.removeEventListener("loadfailed", onLoadFailed);
                    };

                    page.addEventListener("load", onLoad);
                    page.addEventListener("loadfailed", onLoadFailed);
                    page.load();
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
                                if (pub.Id === publicationId) {
                                    resolve(pub.Title);
                                    return;
                                }
                            }
                        }

                        reject(Localization.formatMessage("datastore.publication.not.found", [publicationId]));
                    },
                    error => {
                        reject(error);
                    });
            });
        }

        /**
         * Get the full path for a sitemap item within a sitemap
         *
         * @param {string} pageId The page id
         * @returns {Promise<string[]>} Promise to return the full path
         *
         * @memberOf DataStoreClient
         */
        public getSitemapPath(pageId: string): Promise<string[]> {
            const navigationLinks = this.getNavigationLinksModel(pageId);

            return new Promise((resolve: (path?: string[]) => void, reject: (error: string | null) => void) => {
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
                DataStoreClient.PublicationsModel = new Models.Publications();
            }
            return DataStoreClient.PublicationsModel;
        }

        private getNavigationLinksModel(pageId: string): Models.NavigationLinks {
            if (!DataStoreClient.NavigationLinksModels) {
                DataStoreClient.NavigationLinksModels = {};
            }
            if (!DataStoreClient.NavigationLinksModels[pageId]) {
                // TODO: calculate taxonomy id base on page id
                DataStoreClient.NavigationLinksModels[pageId] = new Models.NavigationLinks("39137-1-512", pageId);
            }
            return DataStoreClient.NavigationLinksModels[pageId];
        }

    }

}
