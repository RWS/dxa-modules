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

import { isEmpty } from "lodash";
import { ISitemapItem } from "interfaces/ServerModels";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Api, API_REQUEST_TYPE_FORM } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { Url } from "utils/Url";
import { localization } from "services/common/LocalizationService";
import { IConditionMap, IPostConditionRequest, IPostConditions } from "store/interfaces/Conditions";

const toTaxonomy: (item: ISitemapItem) =>
    ITaxonomy = (item: ISitemapItem) => ({
        id: item.Id,
        title: item.Title,
        url: item.Url,
        hasChildNodes: item.HasChildNodes
    });

const getTaxonomyItems: (parentId: string, sitemapItems: ISitemapItem[]) =>
    { parentId: string, items: ITaxonomy[] } = (parentId: string, sitemapItems: ISitemapItem[]) => ({
        parentId,
        items: sitemapItems.map(toTaxonomy)
    });

/**
 * Navigation links model
 *
 * @export
 * @class NavigationLinks
 * @extends {LoadableObject}
 */
export class NavigationLinks extends LoadableObject {

    private _publicationId: string;
    private _pageId: string;
    private _taxonomyId: string;
    private _path: ITaxonomy[] = [];
    private _pathWithSiblings: { parentId: string, items: ITaxonomy[] }[] = [];
    private _conditions: IConditionMap;

    /**
     * Creates an instance of NavigationLinks.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     * @param {string} taxonomyId Taxonomy id
     *
     * @memberOf NavigationLinks
     */
    constructor(publicationId: string, pageId: string, taxonomyId: string, conditions: IConditionMap) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
        this._taxonomyId = taxonomyId;
        this._conditions = conditions;
    }

    /**
     * Get the path
     *
     * @returns {ITaxonomy[]} Ids of ancestors
     *
     * @memberOf NavigationLinks
     */
    public getPath(): ITaxonomy[] {
        return this._path;
    }

    /**
     * Get the path including siblings
     *
     * @returns {{ parentId: string, items: ITaxonomy[] }[]} Full path, including siblings
     *
     * @memberOf NavigationLinks
     */
    public getPathWithSiblings(): { parentId: string, items: ITaxonomy[] }[] {
        return this._pathWithSiblings;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getNavigationLinksUrl(this._publicationId, this._taxonomyId);
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
            : Net.postRequest(url, body, API_REQUEST_TYPE_FORM, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._path = this._calculatePath(JSON.parse(result));

        // Validate if the path is pointing to the actual page
        const lastItemInPath = this._path[this._path.length - 1];
        if (lastItemInPath && lastItemInPath.url) {
            const parsedUrl = Url.parsePageUrl(lastItemInPath.url);
            if (parsedUrl && parsedUrl.pageId !== this._pageId) {
                const errorMessage = localization.formatMessage("error.unable.to.locate.page.in.toc", [this._pageId]);
                super._onLoadFailed(errorMessage, null);
                return;
            }
        }

        super._processLoadResult(result, webRequest);
    }

    private _calculatePath(navigationLinks: ISitemapItem[]): ITaxonomy[] {
        const path: ITaxonomy[] = [];
        if (navigationLinks && navigationLinks.length > 0) {
            this._calculateChildPath(path, navigationLinks[0]);
        }
        return path;
    }

    private _calculateChildPath(path: ITaxonomy[], parentItem: ISitemapItem): void {
        const parentId = parentItem.Id || "";
        const items: ISitemapItem[] = parentItem.Items;
        this._pathWithSiblings = this._pathWithSiblings.concat(getTaxonomyItems(parentId, items));

        for (const item of items) {
            if (item.Id && item.Id === this._taxonomyId) {
                path.push(toTaxonomy(item));
                break;
            }
            // If there is a child which has child items the node is nested in a deeper level
            // No need to loop over the entire collection
            if (item.Items.length > 0) {
                path.push(toTaxonomy(item));
                this._calculateChildPath(path, item);
                break;
            }
        }
    }
}
