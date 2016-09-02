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
         * @param {string} pageId Page id
         * @param {string} pageTitle Page title
         */
        public setPageUrl(publicationId: string, publicationTitle: string,
            pageId: string, pageTitle: string): void { }

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
