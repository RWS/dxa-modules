/// <reference path="../models/Page.ts" />
/// <reference path="../models/Toc.ts" />

module Sdl.DitaDelivery {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;

    /**
     * Data store, interacts with the models to fetch the required data.
     *
     * @export
     * @class DataStore
     */
    export class DataStoreClient implements IDataStore {

        /**
         * Table of content models
         *
         * @private
         * @static
         * @type {{ [parentId:string]: Models.Toc }}
         */
        private TocModels: { [parentId: string]: Models.Toc };

        /**
         * Page models
         *
         * @private
         * @static
         * @type {{ [pageId:string]: Models.Page }}
         */
        private PageModels: { [pageId: string]: Models.Page };

        /**
         * Get the root objects of the sitemap
         *
         * @static
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapRoot(callback: (error: string, children: ISitemapItem[]) => void): void {
            this.getSitemapItems("root", callback);
        }

        /**
         * Get the site map items for a parent
         *
         * @static
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
         * @static
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
            if (!this.TocModels) {
                this.TocModels = {};
            }
            if (!this.TocModels[parentId]) {
                this.TocModels[parentId] = new Models.Toc(parentId);
            }
            return this.TocModels[parentId];
        }

        private getPageModel(pageId: string): Models.Page {
            if (!this.PageModels) {
                this.PageModels = {};
            }
            if (!this.PageModels[pageId]) {
                this.PageModels[pageId] = new Models.Page(pageId);
            }
            return this.PageModels[pageId];
        }

    }

}
