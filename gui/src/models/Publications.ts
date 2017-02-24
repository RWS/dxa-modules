import * as ServerModels from "interfaces/ServerModels";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "sdl-models";

import { localization } from "services/common/LocalizationService";

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

    private _unknownProductFamilyTitle: string = localization.formatMessage("components.productfamilies.unknown.title");

    /**
     * Get the Publications
     *
     * @param {string} productFamily productFamily title
     * @returns {IPublication[]}
     */
    public getPublications(productFamily?: string): IPublication[] {
        if (productFamily) {
            const familyTitle = (productFamily === this._unknownProductFamilyTitle) ? undefined : productFamily;
            return this._publications.filter((publication: IPublication) => {
                if (!familyTitle) {
                     return !publication.productFamily;
                }
                return (publication.productFamily === familyTitle);
            });
        }

        return this._publications;
    }

    /**
     * Get product families
     *
     * @returns {IProductFamily[]}
     */
    public getProductFamilies(): IProductFamily[] {
        if (!this._productFamilies) {
            const publications = this.getPublications();
            if (publications) {
                let distinctFamilies: (string | undefined)[] = publications.map((publication: IPublication) => {
                    return publication.productFamily || "unknown";
                }).filter((family: string, i: number, arr: string[]) => {
                    return arr.indexOf(family) == i;
                });

                // Implementing case in-sensetive sort
                distinctFamilies.sort((left: string | undefined, right: string | undefined) => {
                    return (left || "").toLowerCase().localeCompare((right || "").toLowerCase());
                });

                this._productFamilies = distinctFamilies.map((family: string | undefined) => {
                    if (family === "unknown") {
                        return {
                            title: localization.formatMessage("components.productfamilies.unknown.title"),
                            description: localization.formatMessage("components.productfamilies.unknown.description"),
                            hasWarning: true
                        } as IProductFamily;
                    } else {
                        return {
                            // Only title now, description would go here later on
                            title: family
                        } as IProductFamily;
                    }
                });
            }
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
