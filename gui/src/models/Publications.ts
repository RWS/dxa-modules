import { path } from "../utils/Path";
import { IPublication } from "../interfaces/ServerModels";

// Global Catalina dependencies
import IWebRequest = SDL.Client.Net.IWebRequest;
import LoadableObject = SDL.Client.Models.LoadableObject;
import OO = SDL.Client.Types.OO;
import Net = SDL.Client.Net;

/* tslint:disable-next-line */
eval(SDL.Client.Types.OO.enableCustomInheritance);
/**
 * Publications model
 *
 * @export
 * @class Publications
 * @extends {LoadableObject}
 */
export class Publications extends LoadableObject {

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
        const url = path.getAbsolutePath(`gui/mocks/publications.json`);
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._publications = JSON.parse(result);

        super._processLoadResult(result, webRequest);
    }

    protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
        const p = this.properties;
        p.loading = false;
        this.fireEvent("loadfailed", { error: error });
    }
}

OO.createInterface("Sdl.DitaDelivery.Models.Publications", Publications);
