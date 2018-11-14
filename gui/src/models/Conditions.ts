/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
