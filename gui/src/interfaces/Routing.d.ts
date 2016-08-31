declare module Sdl.DitaDelivery {

    /**
     * Routing instance
     */
    // tslint:disable-next-line:no-unused-variable
    var Routing: IRouting;

    /**
     * Routing implementation
     */
    interface IRouting {

        /**
         * Get the current location
         *
         * @returns {string}
         */
        getCurrentLocation(): string;

        /**
         * Get the absolute path
         *
         * @param {string} path Path
         * @returns {string}
         */
        getAbsolutePath(path: string): string;

        /**
         * Set the publication
         *
         * @param {string} id Publication id
         * @param {string} title Publication title
         */
        setPublication(id: string, title: string): void;

        /**
         * Set the sitemap item
         *
         * @param {string} id Sitemap item id
         * @param {string} title Sitemap title
         */
        setSitemapItem(id: string, title: string): void;
    }
}
