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

import * as ServerModels from "interfaces/ServerModels";
import { isEmpty } from "lodash";
import { IPage } from "interfaces/Page";
import { Api, API_REQUEST_TYPE_FORM } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { IConditionMap, IPostConditions, IPostConditionRequest } from "store/interfaces/Conditions";

export const response2page = (serverPage: ServerModels.IPage): IPage => {
    let pageTitle = "";
    let pageBody = "";
    const regions = serverPage.Regions;
    if (Array.isArray(regions) && regions.length > 0) {
        const entities = regions[0].Entities;
        if (Array.isArray(entities) && entities.length > 0) {
            pageTitle = entities[0].topicTitle;
            const topicBody = entities[0].topicBody;
            if (topicBody && Array.isArray(topicBody.Fragments) && topicBody.Fragments.length > 0) {
                pageBody = topicBody.Fragments[0].Html;
            }
        }
    }
    const logicalId = serverPage.Meta["ishlogicalref.object.id"];
    const navEntries = serverPage.Meta["tocnaventries.generated.value"];
    return {
        id: serverPage.Id,
        title: pageTitle,
        content: pageBody,
        logicalId,
        sitemapIds: typeof navEntries === "string" ? navEntries.split(", ") : navEntries
    } as IPage;
};

/**
 * Page model
 *
 * @export
 * @class Page
 * @extends {LoadableObject}
 */
export class Page extends LoadableObject {
    protected _publicationId: string;
    protected _pageId: string;
    protected _conditions: IConditionMap;
    protected _page: IPage;

    /**
     * Creates an instance of Page.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     */
    constructor(publicationId: string, pageId: string, conditions: IConditionMap = {}) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
        this._conditions = conditions;
    }

    /**
     * Get the page info
     *
     * @returns {IPage}
     */
    public getPage(): IPage {
        return this._page;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getPageUrl(this._publicationId, this._pageId);
        let postConditions: IPostConditions = {};
        for (let key in this._conditions) {
            if (this._conditions.hasOwnProperty(key)) {
                postConditions[key] = this._conditions[key].values;
            }
        }
        const postBody: IPostConditionRequest = { publicationId: +this._publicationId, userConditions: postConditions };
        const body = `conditions=${JSON.stringify(postBody)}`;
        isEmpty(this._conditions)
            ? Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed))
            : Net.postRequest(
                  url,
                  body,
                  API_REQUEST_TYPE_FORM,
                  this.getDelegate(this._onLoad),
                  this.getDelegate(this._onLoadFailed)
              );
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._page = response2page(JSON.parse(result) as ServerModels.IPage);
        super._processLoadResult(result, webRequest);
    }
}
