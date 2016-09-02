/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IPage = Server.Models.IPage;
    import IWebRequest = SDL.Client.Net.IWebRequest;

    /**
     * Page info
     *
     * @export
     * @interface IPageInfo
     */
    export interface IPageInfo {
        title: string;
        content: string;
    }

    /* tslint:disable-next-line */
    eval(SDL.Client.Types.OO.enableCustomInheritance);
    /**
     * Page model
     *
     * @export
     * @class Page
     * @extends {SDL.Client.Models.LoadableObject}
     */
    export class Page extends SDL.Client.Models.LoadableObject {

        private _pageId: string;
        private _page: IPage;

        /**
         * Creates an instance of Page.
         *
         * @param {string} pageId
         */
        constructor(pageId: string) {
            super();
            this._pageId = pageId;
        }

        /**
         * Get the page info
         *
         * @returns {IPageInfo}
         */
        public getPageInfo(): IPageInfo {
            return {
                content: this._page.Html,
                title: this._page.Title
            };
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/page-${this._stripId(this._pageId)}.json`);
            SDL.Client.Net.getRequest(url,
                this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: IWebRequest): void {
            this._page = JSON.parse(result);

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

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.Page", Page);
}
