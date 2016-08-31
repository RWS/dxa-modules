/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/Routing.d.ts" />

module Sdl.DitaDelivery {
    const HistoryModule = (<Window & { History: HistoryModule.Module }>window).History;

    /**
     * Routing related functionality
     *
     * @export
     * @class Routing
     */
    export class RoutingClient implements IRouting {

        private static _history: HistoryModule.History = HistoryModule.createHistory();
        private _root: string;

        /**
         * Creates an instance of RoutingClient.
         *
         * @param {string} [root="/"] Root path of the application.
         */
        constructor(root: string = "/") {
            this._root = root;
        }

        /**
         * Get the current location
         *
         * @returns {string}
         */
        public getCurrentLocation(): string {
            return RoutingClient._history.getCurrentLocation().pathname;
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
         * Set the publication
         *
         * @param {string} id Publication id
         * @param {string} title Publication title
         */
        public setPublication(id: string, title: string): void {
            const pathname = this.getAbsolutePath(
                encodeURIComponent(id) + "/"
                + encodeURIComponent(this._escapeTitle(title)));
            RoutingClient._history.push({
                pathname: pathname
            });
        }

        /**
         * Set the sitemap item
         *
         * @param {string} id Sitemap item id
         * @param {string} title Sitemap title
         */
        public setSitemapItem(id: string, title: string): void {
            const publicationUrl = "pub/123/";
            const pathname = this.getAbsolutePath(
                publicationUrl +
                encodeURIComponent(id) + "/" +
                encodeURIComponent(this._escapeTitle(title))
            );

            RoutingClient._history.push({
                pathname: pathname
            });
        }

        private _escapeTitle(title: string): string {
            return title.replace(/\s/gi, "-");
        }
    }

}
