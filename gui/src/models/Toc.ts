/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IWebRequest = SDL.Client.Net.IWebRequest;
    import TcmIdUtils = Utils.TcmId;

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

        private _publicationId: string;
        private _parentId: string;
        private _sitemapItems: ISitemapItem[];

        /**
         * Creates an instance of Toc.
         *
         * @param {string} publicationId Publication id
         * @param {string} parentId Parent sitemap item id, for the root item pass "root" as the parent id.
         */
        constructor(publicationId: string, parentId: string) {
            super();
            this._publicationId = publicationId;
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
            const taxonomyId = TcmIdUtils.getTaxonomyId(this._publicationId);

            if (this._parentId === "root" && !taxonomyId) {
                this._onLoadFailed(Localization.formatMessage("error.path.not.found", [this._parentId, this._publicationId]));
            } else {
                const parentPart = this._parentId !== "root" ?
                    TcmIdUtils.removeNamespace(this._parentId) :
                    `root-${TcmIdUtils.removeNamespace(taxonomyId || "")}`;
                const url = Routing.getAbsolutePath(`gui/mocks/toc-${parentPart}.json`);
                SDL.Client.Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
            }
        }

        protected _processLoadResult(result: string, webRequest: IWebRequest): void {
            this._sitemapItems = JSON.parse(result);

            super._processLoadResult(result, webRequest);
        }

        protected _onLoadFailed(error: string, webRequest?: IWebRequest): void {
            const p = this.properties;
            p.loading = false;
            this.fireEvent("loadfailed", { error: error });
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.Toc", Toc);
}
