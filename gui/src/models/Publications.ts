import * as ServerModels from "interfaces/ServerModels";
import { IPublication } from "interfaces/Publication";
import { Api } from "utils/Api";
import { getRequest, IWebRequest, LoadableObject } from "sdl-models";

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
        const url = Api.getPublicationsUrl();
        getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._publications = (JSON.parse(result) as ServerModels.IPublication[]).map((item: ServerModels.IPublication) => {
            return {
                id: item.Id,
                title: item.Title
            } as IPublication;
        });

        super._processLoadResult(result, webRequest);
    }
}
