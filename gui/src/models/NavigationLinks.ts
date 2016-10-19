/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IWebRequest = SDL.Client.Net.IWebRequest;
    import ISitemapItem = Server.Models.ISitemapItem;
    import TcmIdUtils = Utils.TcmId;

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
        private _taxonomyId: string;
        private _path: ISitemapItem[] = [];

        /**
         * Creates an instance of NavigationLinks.
         *
         * @param {string} taxonomyId Taxonomy id
         * @param {string} pageId Page id
         *
         * @memberOf NavigationLinks
         */
        constructor(taxonomyId: string, pageId: string) {
            super();
            this._taxonomyId = taxonomyId;
            this._pageId = pageId;
        }

        /**
         * Get the path
         *
         * @returns {ISitemapItem[]} Ids of ancestors
         *
         * @memberOf NavigationLinks
         */
        public getPath(): ISitemapItem[] {
            return this._path;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/navigation-${TcmIdUtils.removeNamespace(this._taxonomyId)}-${TcmIdUtils.removeNamespace(this._pageId)}.json`);
            SDL.Client.Net.getRequest(url,
                this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: IWebRequest): void {

            this._path = this._calculatePath(JSON.parse(result));

            super._processLoadResult(result, webRequest);
        }

        protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
            const p = this.properties;
            p.loading = false;
            this.fireEvent("loadfailed", { error: error });
        }

        private _calculatePath(navigationLinks: ISitemapItem): ISitemapItem[] {
            const path: ISitemapItem[] = [];
            let items: ISitemapItem[] = navigationLinks.Items;
            if (navigationLinks.Id) {
                path.push(navigationLinks);
            }
            while (items && items.length > 0) {
                const firstItem = items[0];
                items = firstItem.Items;
                if (firstItem.Id) {
                    path.push(firstItem);
                }
            }
            return path;
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.NavigationLinks", NavigationLinks);
}
