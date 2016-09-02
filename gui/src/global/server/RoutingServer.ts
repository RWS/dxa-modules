/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../interfaces/Routing.d.ts" />

module Sdl.DitaDelivery {

    /**
     * Routing related functionality
     *
     * @export
     * @class Routing
     */
    export class RoutingServer implements IRouting {

        private _root: string = "/";

        /**
         * Get the absolute path
         *
         * @param {string} path Path
         * @returns {string}
         */
        public getAbsolutePath(path: string): string {
            return this._root + path;
        }

        /**
         * Set page url
         *
         * @param {string} publicationId Publication id
         * @param {string} publicationTitle Publication title
         * @param {string} sitemapItemId Sitemap item id
         * @param {string} sitemapItemTitle Sitemap item title
         */
        public setPublicationLocation(publicationId: string, publicationTitle: string,
            sitemapItemId: string, sitemapItemTitle: string): void { }

        /**
         * Get the current location within a publication
         *
         * @returns {IPublicationLocation}
         */
        public getPublicationLocation(): IPublicationLocation {
            return {
                publicationId: null,
                sitemapItemId: null
            };
        }
    }

}
