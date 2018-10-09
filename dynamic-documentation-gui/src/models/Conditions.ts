import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { IConditionMap } from "store/interfaces/Conditions";

/**
 *
 * @export
 * @class Conditions
 * @extends {LoadableObject}
 */
export class Conditions extends LoadableObject {
    private _publicationId: string;
    private _conditions: IConditionMap;
    private _preLoaded: boolean = false;

    /**
     * Creates an instance of Conditions.
     * @param {string} publicationId
     * @param {IConditionMap} [items]
     *
     * @memberof Conditions
     */
    constructor(publicationId: string, items?: IConditionMap) {
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
     * @returns {IConditionMap}
     *
     * @memberof Conditions
     */
    public getConditons(): IConditionMap {
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
        this._conditions = res;
        super._processLoadResult(result, webRequest);
    }
}
