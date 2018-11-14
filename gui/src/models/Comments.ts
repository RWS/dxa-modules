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
import { IComment } from "interfaces/ServerModels";

export class Comments extends LoadableObject {
    private _publicationId: string;
    private _pageId: string;
    private _descending: boolean;
    private _top: number;
    private _skip: number;
    private _status: number[];
    private _comments: IComment[];
    private _preLoaded: boolean = false;

    constructor(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[], items?: IComment[]) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
        this._descending = descending;
        this._top = top;
        this._skip = skip;
        this._status = status;

        if (items) {
            this._comments = items;
            this._preLoaded = true;
        }
    }

    public getComments(): IComment[] {
        return this._comments;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        if (this._preLoaded) {
            // Reset preloaded state, on the second load it should use build in caching mechanism of loadable object
            // This is only needed to prevent the initial http request to be executed
            this._preLoaded = false;
            this._setLoaded();
        } else {
            const url = Api.getCommentsUrl(this._publicationId, this._pageId, this._descending, this._top, this._skip, this._status);
            Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const res = JSON.parse(result);
        this._comments = res;
        super._processLoadResult(result, webRequest);
    }
}
