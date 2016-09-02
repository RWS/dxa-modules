/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../interfaces/Routing.d.ts" />

module Sdl.DitaDelivery {
    const HistoryModule = (<Window & { History: HistoryModule.Module }>window).History;

    /**
     * Regex to validate if a url is pointing to a publication + page
     *
     * example: /ish:39137-1-1/ish:39137-1-512/MP330/User-Guide
     */
    const PUBLICATION_URL_REGEX = /^\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/.*$/gmi;

    /**
     * Routing related functionality
     *
     * @export
     * @class Routing
     */
    export class RoutingClient implements IRouting {

        private static _history: HistoryModule.History;
        private _root: string;

        /**
         * Creates an instance of RoutingClient.
         *
         * @param {string} [root="/"] Root path of the application.
         * @param {boolean} [inMemory=false] When true no urls will be updated, urls will be managed in memory.
         */
        constructor(root: string = "/", inMemory: boolean = false) {
            this._root = root;
            if (!inMemory) {
                RoutingClient._history = HistoryModule.createHistory();
            } else {
                RoutingClient._history = HistoryModule.createMemoryHistory();
            }
        }

        /**
         * Use this hook to be notified on location changes
         *
         * @param {() => void} handler Handler which will be triggered upon a location change.
         */
        public onLocationChanged(handler: () => void): void {
            RoutingClient._history.listen(handler);
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

            const pathname = this.getAbsolutePath(
                encodeURIComponent(publicationId) + "/" +
                encodeURIComponent(sitemapItemId) + "/" +
                encodeURIComponent(this._escapeTitle(publicationTitle)) + "/" +
                encodeURIComponent(this._escapeTitle(sitemapItemTitle))
            );

            this._push(pathname);
        }

        /**
         * Get the current location within a publication
         *
         * @returns {IPublicationLocation}
         */
        public getPublicationLocation(): IPublicationLocation {
            const currentLocation = RoutingClient._history.getCurrentLocation().pathname;
            const paths = currentLocation.match(PUBLICATION_URL_REGEX);
            if (paths) {
                var result = paths[0].split("/");
                return {
                    publicationId: decodeURIComponent(result[1]),
                    sitemapItemId: decodeURIComponent(result[2])
                };
            }
            return;
        }

        private _escapeTitle(title: string): string {
            return title.replace(/\s/gi, "-");
        }

        private _push(pathname: string): void {
            RoutingClient._history.push({
                pathname: pathname
            });
        }
    }

}
