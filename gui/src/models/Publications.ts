import * as ServerModels from "interfaces/ServerModels";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "sdl-models";

/**
 * Publications model
 *
 * @export
 * @class Publications
 * @extends {LoadableObject}
 */
export class Publications extends LoadableObject {

    private _publications: IPublication[];
    private _productFamilies?: IProductFamily[];

    /**
     * Get the Publications
     *
     * @returns {IPublication[]}
     */
    public getPublications(): IPublication[] {
        return this._publications;
    }

    /**
     * Get product families
     *
     * @returns {IProductFamily[]}
     */
    public getProductFamilies(): IProductFamily[] {
        if (!this._productFamilies) {
            const publications = this._publications;
            this._productFamilies = publications.map((publication: IPublication) => {
                return publication.productFamily;
            }).filter((family: string, i: number, arr: string[]) => {
                return arr.indexOf(family) == i;
            }).map((family: string) => {
                return {
                    // Only title now, description would go here later on
                    title: family
                } as IProductFamily;
            });
        }
        return this._productFamilies || [];
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getPublicationsUrl();
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._publications = (JSON.parse(result) as ServerModels.IPublication[]).map((item: ServerModels.IPublication) => {
            return {
                id: item.Id,
                title: item.Title,
                productFamily: item.ProductFamily,
                productReleaseVersion: item.ProductReleaseVersion
            } as IPublication;
        });

        this._productFamilies = undefined;

        super._processLoadResult(result, webRequest);
    }
}
