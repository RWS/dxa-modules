/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IPage = Server.Models.IPage;
    import IWebRequest = SDL.Client.Net.IWebRequest;
    import TcmIdUtils = Utils.TcmId;

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

        private _publicationId: string;
        private _pageId: string;
        private _page: IPage;

        /**
         * Creates an instance of Page.
         *
         * @param {string} publicationId Publication id
         * @param {string} pageId Page id
         */
        constructor(publicationId: string, pageId: string) {
            super();
            this._publicationId = publicationId;
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
            const url = Routing.getAbsolutePath(`gui/mocks/page-${TcmIdUtils.removeNamespace(this._pageId)}.json`);
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
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.Page", Page);
}
