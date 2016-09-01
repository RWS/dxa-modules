/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IWebRequest = SDL.Client.Net.IWebRequest;

    /* tslint:disable-next-line */
    eval(SDL.Client.Types.OO.enableCustomInheritance);
    /**
     * Toc model, used for interacting with the server and doing basic operations on the model itself.
     *
     * @export
     * @class Toc
     * @extends {SDL.Client.Models.LoadableObject}
     */
    export class Toc extends SDL.Client.Models.LoadableObject {

        private _parentId: string;
        private _sitemapItems: ISitemapItem[];

        /**
         * Creates an instance of Toc.
         *
         * @param {string} parentId
         */
        constructor(parentId: string) {
            super();
            this._parentId = parentId;
        }

        /**
         * Get the site map items
         *
         * @returns {ISitemapItem[]}
         */
        public getSitemapItems(): ISitemapItem[] {
            return this._sitemapItems;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/toc-${this._stripId(this._parentId)}.json`);
            SDL.Client.Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: IWebRequest): void {
            this._sitemapItems = JSON.parse(result);

            super._processLoadResult(result, webRequest);
        }

        protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
            this.fireEvent("loadfailed", { error: error });
        }

        private _stripId(id: string): string {
            if (id.indexOf("ish:") !== -1) {
                return id.substring(4);
            }
            return id;
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.Toc", Toc);
}
