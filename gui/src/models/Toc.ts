/// <reference path="../../typings/index.d.ts" />

module Sdl.KcWebApp.Models {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IWebRequest = SDL.Client.Net.IWebRequest;

    /* tslint:disable-next-line */
    eval(SDL.Client.Types.OO.enableCustomInheritance);
    export class Toc extends SDL.Client.Models.LoadableObject {

        private _parentId: string;
        private _sitemapItems: ISitemapItem[];

        constructor(parentId: string) {
            super();
            this._parentId = parentId;
        }

        public getSitemapItems(): ISitemapItem[] {
            return this._sitemapItems;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            SDL.Client.Net.getRequest(`gui/mocks/toc-${this._stripId(this._parentId)}.json`, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: SDL.Client.Net.IWebRequest): void {
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

    SDL.Client.Types.OO.createInterface("Sdl.KcWebApp.Models.Toc", Toc);
}
