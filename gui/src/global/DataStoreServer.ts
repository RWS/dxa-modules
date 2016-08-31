/// <reference path="../models/Page.ts" />
/// <reference path="../models/Toc.ts" />

module Sdl.DitaDelivery {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;
    import IPublication = Server.Models.IPublication;

    /**
     * Data store for the server.
     *
     * @export
     * @class DataStore
     */
    export class DataStoreServer implements IDataStore {

        private _mockDataPublications: {
            error: string;
            publications: IPublication[];
        } = {
            error: null,
            publications: []
        };

        private _mockDataPage: {
            error: string;
            info: IPageInfo;
        } = {
            error: null,
            info: {
                content: "<span>Page content!</span>",
                title: "Page title!"
            }
        };

        private _mockDataToc: {
            error: string;
            children: ISitemapItem[]
        } = {
            error: null,
            children: []
        };

        /**
         * Get the list of publications
         *
         * @param {(error: string, publications?: IPublication[]) => void} callback Returns the items
         */
        public getPublications(callback: (error: string, publications?: IPublication[]) => void): void {
            const { error, publications } = this._mockDataPublications;
            callback(error, publications);
        }

        /**
         * Get the root objects of the sitemap
         *
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapRoot(callback: (error: string, children?: ISitemapItem[]) => void): void {
            return this.getSitemapItems("root", callback);
        }

        /**
         * Get the site map items for a parent
         *
         * @param {string} parentId The parent id
         * @param {(error: string, children?: ISitemapItem[]) => void} callback Returns the items
         */
        public getSitemapItems(parentId: string, callback: (error: string, children?: ISitemapItem[]) => void): void {
            const { error, children } = this._mockDataToc;
            callback(error, children);
        }

        /**
         * Get page information
         *
         * @param {string} pageId The page id
         * @param {(error: string, info?: IPageInfo) => void} callback Returns the content
         */
        public getPageInfo(pageId: string, callback: (error: string, info?: IPageInfo) => void): void {
            const { error, info } = this._mockDataPage;
            callback(error, info);
        }

    }

}
