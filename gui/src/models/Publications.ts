/// <reference path="../../typings/index.d.ts" />

module Sdl.DitaDelivery.Models {

    import IPublication = Server.Models.IPublication;
    import IWebRequest = SDL.Client.Net.IWebRequest;

    /* tslint:disable-next-line */
    eval(SDL.Client.Types.OO.enableCustomInheritance);
    /**
     * Publications model
     *
     * @export
     * @class Publications
     * @extends {SDL.Client.Models.LoadableObject}
     */
    export class Publications extends SDL.Client.Models.LoadableObject {

        private _publications: IPublication[];

        /**
         * Get the Publications
         *
         * @returns {IPublication[]}
         */
        public getPublications(): IPublication[] {
            return this._publications;
        }

        /* Overloads */
        protected _executeLoad(reload: boolean): void {
            const url = Routing.getAbsolutePath(`gui/mocks/publications.json`);
            SDL.Client.Net.getRequest(url,
                this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }

        protected _processLoadResult(result: string, webRequest: SDL.Client.Net.IWebRequest): void {
            this._publications = JSON.parse(result);

            super._processLoadResult(result, webRequest);
        }

        protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
            this.fireEvent("loadfailed", { error: error });
        }
    }

    SDL.Client.Types.OO.createInterface("Sdl.DitaDelivery.Models.Publications", Publications);
}
