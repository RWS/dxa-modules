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
         * Use this hook to be notified on location changes
         *
         * @param {() => void} handler Handler which will be triggered upon a location change.
         */
        public onLocationChanged(handler: () => void): void {
            throw new Error(`Should not be used on a server side environment.`);
        }

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
            sitemapItemId: string, sitemapItemTitle: string): void {
             // TODO implement this
        }

        /**
         * Get the current location within a publication
         *
         * @returns {IPublicationLocation}
         */
        public getPublicationLocation(): IPublicationLocation {
            // TODO implement this
            return {
                publicationId: "",
                sitemapItemId: ""
            };
        }
    }

}
