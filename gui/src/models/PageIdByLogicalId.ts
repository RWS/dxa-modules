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

/**
 * PageIdByLogicalId model
 *
 * @export
 * @class PageIdByLogicalId
 * @extends {LoadableObject}
 */
export class PageIdByLogicalId extends LoadableObject {
    private _logicalId: string;
    private _publicationId: string;
    private _pageId: string;
    /**
     * Creates an instance of PageIdByLogicalId.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Logical id
     */
    constructor(publicationId: string, logicalId: string) {
        super();
        this._publicationId = publicationId;
        this._logicalId = logicalId;
    }

    /**
     * Get the page id
     *
     * @returns {string}
     */
    public getPageId(): string {
        return this._pageId;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        Net.getRequest(
            Api.getPageIdByReferenceUrl(this._publicationId, this._logicalId),
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed)
        );
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._pageId = (JSON.parse(result) as { id: string }).id;
        super._processLoadResult(result, webRequest);
    }
}
