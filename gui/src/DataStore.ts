/// <reference path="models/Page.ts" />
/// <reference path="models/Toc.ts" />

module Sdl.DitaDelivery {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;

    /**
     * Data store, interacts with the models to fetch the required data.
     *
     * @export
     * @class DataStore
     */
    export class DataStore {

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
         * Get the root objects of the sitemap
         *
         * @static
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        public static getSitemapRoot(callback: (error: string, children: ISitemapItem[]) => void): void {
            this.getSitemapItems("root", callback);
        }

        /**
         * Get the site map items for a parent
         *
         * @static
         * @param {string} parentId The parent id
         * @param {(error: string, children?: ISitemapItem[]) => void} callback Returns the items
         */
        public static getSitemapItems(parentId: string, callback: (error: string, children?: ISitemapItem[]) => void): void {
            const toc = DataStore.getTocModel(parentId);
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
         * @static
         * @param {string} pageId The page id
         * @param {(error: string, info?: IPageInfo) => void} callback Returns the content
         */
        public static getPageInfo(pageId: string, callback: (error: string, info?: IPageInfo) => void): void {
            const page = DataStore.getPageModel(pageId);
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

        private static getTocModel(parentId: string): Models.Toc {
            if (!DataStore.TocModels) {
                DataStore.TocModels = {};
            }
            if (!DataStore.TocModels[parentId]) {
                DataStore.TocModels[parentId] = new Models.Toc(parentId);
            }
            return DataStore.TocModels[parentId];
        }

        private static getPageModel(pageId: string): Models.Page {
            if (!DataStore.PageModels) {
                DataStore.PageModels = {};
            }
            if (!DataStore.PageModels[pageId]) {
                DataStore.PageModels[pageId] = new Models.Page(pageId);
            }
            return DataStore.PageModels[pageId];
        }

    }

}
