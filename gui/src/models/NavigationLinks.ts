/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IWebRequest = SDL.Client.Net.IWebRequest;
    import INavigationLinks = Server.Models.INavigationLinks;

    /* tslint:disable-next-line */
    eval(SDL.Client.Types.OO.enableCustomInheritance);
    /**
     * Navigation links model
     *
     * @export
     * @class NavigationLinks
     * @extends {SDL.Client.Models.LoadableObject}
     */
    export class NavigationLinks extends SDL.Client.Models.LoadableObject {

        private _pageId: string;
        private _navigationLinks: INavigationLinks;

        /**
         * Creates an instance of NavigationLinks.
         *
         * @param {string} pageId
         */
        constructor(pageId: string) {
            super();
            this._pageId = pageId;
        }

        /**
         * Get the navigation links
         * Typically used for displaying breadcrumbs
         *
         * @returns {INavigationLinks}
         */
        public getNavigationLinks(): INavigationLinks {
            return this._navigationLinks;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/navigation-${this._stripId(this._pageId)}.json`);
            SDL.Client.Net.getRequest(url,
                this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: IWebRequest): void {
            this._navigationLinks = JSON.parse(result);

            super._processLoadResult(result, webRequest);
        }

        protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
            const p = this.properties;
            p.loading = false;
            this.fireEvent("loadfailed", { error: error });
        }

        private _stripId(id: string): string {
            if (id.indexOf("ish:") !== -1) {
                return id.substring(4);
            }
            return id;
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.NavigationLinks", NavigationLinks);
}
