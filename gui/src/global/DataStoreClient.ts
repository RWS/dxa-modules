/// <reference path="../models/Page.ts" />
/// <reference path="../models/Publications.ts" />
/// <reference path="../models/Toc.ts" />

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

    }

}
