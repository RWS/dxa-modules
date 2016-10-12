/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IWebRequest = SDL.Client.Net.IWebRequest;
    import ISitemapItem = Server.Models.ISitemapItem;

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
        private _path: string[] = [];

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
         * @returns {string[]} Ids of ancestors
         *
         * @memberOf NavigationLinks
         */
        public getPath(): string[] {
            return this._path;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/navigation-${this._stripId(this._taxonomyId)}-${this._stripId(this._pageId)}.json`);
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

        private _stripId(id: string): string {
            if (id.indexOf("ish:") !== -1) {
                return id.substring(4);
            }
            return id;
        }

        private _calculatePath(navigationLinks: ISitemapItem): string[] {
            const path: string[] = [];
            let items: ISitemapItem[] = navigationLinks.Items;
            if (navigationLinks.Id) {
                path.push(navigationLinks.Id);
            }
            while (items && items.length > 0) {
                const firstItem = items[0];
                items = firstItem.Items;
                if (firstItem.Id) {
                    path.push(firstItem.Id);
                }
            }
            return path;
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.NavigationLinks", NavigationLinks);
}
