import { ICondition } from "interfaces/ServerModels";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";

/**
 *
 * @export
 * @class Conditions
 * @extends {LoadableObject}
 */
export class Conditions extends LoadableObject {
    private _publicationId: string;
    private _conditions: ICondition[];
    private _preLoaded: boolean = false;

    /**
     * Creates an instance of Conditions.
     * @param {string} publicationId
     * @param {ICondition[]} [items]
     *
     * @memberof Conditions
     */
    constructor(publicationId: string, items?: ICondition[]) {
        super();
        this._publicationId = publicationId;
        if (items) {
            this._conditions = items;
            this._preLoaded = true;
        }
    }

    /**
     * Get list of conditions
     *
     * @returns {ICondition[]}
     *
     * @memberof Conditions
     */
    public getConditons(): ICondition[] {
        return this._conditions;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        if (this._preLoaded) {
            // Reset preloaded state, on the second load it should use build in caching mechanism of loadable object
            // This is only needed to prevent the initial http request to be executed
            this._preLoaded = false;
            this._setLoaded();
        } else {
            const url = Api.getConditionsUrl(this._publicationId);
            Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const res = JSON.parse(result);
        this._conditions = Object.keys(res).map((key) => {
            return {
                datatype: res[key].datatype,
                range: res[key].range,
                values: res[key].values
            } as ICondition;
        });

        super._processLoadResult(result, webRequest);
    }
}
