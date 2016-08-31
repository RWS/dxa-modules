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
         * Set page url
         *
         * @param {string} publicationId Publication id
         * @param {string} publicationTitle Publication title
         * @param {string} pageId Page id
         * @param {string} pageTitle Page title
         */
        public setPageUrl(publicationId: string, publicationTitle: string,
            pageId: string, pageTitle: string): void {

            const pathname = this.getAbsolutePath(
                encodeURIComponent(publicationId) + "/" +
                encodeURIComponent(pageId) + "/" +
                encodeURIComponent(this._escapeTitle(publicationTitle)) + "/" +
                encodeURIComponent(this._escapeTitle(pageTitle))
            );

            this._push(pathname);
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
