/// <reference path="models/Toc.ts" />

module Sdl.KcWebApp {

    import ISitemapItem = Server.Models.ISitemapItem;

    /**
     * Data store, interacts with the models to fetch the required data.
     *
     * @export
     * @class DataStore
     */
    export class DataStore {

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
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        public static getSitemapItems(parentId: string, callback: (error: string, children: ISitemapItem[]) => void): void {
            const toc = new Sdl.KcWebApp.Models.Toc(parentId);
            const onLoad = () => {
                toc.removeEventListener("load", onLoad);
                callback(null, toc.getSitemapItems());
            };
            const onLoadFailed = (event: SDL.Client.Event.Event) => {
                toc.removeEventListener("loadfailed", onLoadFailed);
                callback(event.data.error, []);
            };
            toc.addEventListener("load", onLoad);
            toc.addEventListener("loadfailed", onLoadFailed);
            toc.load();
        }

    }

}
