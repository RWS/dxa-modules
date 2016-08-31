declare module Sdl.DitaDelivery {
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;
    import IPublication = Server.Models.IPublication;

    /**
     * Data Store instance
     */
    // tslint:disable-next-line:no-unused-variable
    var DataStore: IDataStore;

    /**
     * Data Store implementation
     */
    interface IDataStore {

        /**
         * Get the list of publications
         *
         * @param {(error: string, publications?: IPublication[]) => void} callback Returns the items
         */
        getPublications(callback: (error: string, publications?: IPublication[]) => void): void;

        /**
         * Get the root objects of the sitemap
         *
         * @param {(error: string, children: ISitemapItem[]) => void} callback Returns the items
         */
        getSitemapRoot(callback: (error: string, items?: ISitemapItem[]) => void): void;

        /**
         * Get the site map items for a parent
         *
         * @param {string} parentId The parent id
         * @param {(error: string, children?: ISitemapItem[]) => void} callback Returns the items
         */
        getSitemapItems(parentId: string, callback: (error: string, items?: ISitemapItem[]) => void): void;

        /**
         * Get page information
         *
         * @param {string} pageId The page id
         * @param {(error: string, info?: IPageInfo) => void} callback Returns the content
         */
        getPageInfo(pageId: string, callback: (error: string, info?: IPageInfo) => void): void;
    }
}
