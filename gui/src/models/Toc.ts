import { isEmpty } from "lodash";
import { ISitemapItem } from "interfaces/ServerModels";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { IConditionMap, IPostConditionMap } from "store/reducers/conditions/IConditions";

/**
 * Toc model, used for interacting with the server and doing basic operations on the model itself.
 *
 * @export
 * @class Toc
 * @extends {LoadableObject}
 */
export class Toc extends LoadableObject {

    private _publicationId: string;
    private _parentId: string;
    private _conditions: IConditionMap;
    private _sitemapItems: ITaxonomy[];
    private _preLoaded: boolean = false;

    /**
     * Creates an instance of Toc.
     *
     * @param {string} publicationId Publication id
     * @param {string} parentId Parent sitemap item id, for the root item pass "root" as the parent id.
     * @param {ITaxonomy[]} items Create a toc model which has the data prefetched.
     */
    constructor(publicationId: string, parentId: string, conditions: IConditionMap, items?: ITaxonomy[]) {
        super();
        this._publicationId = publicationId;
        this._parentId = parentId;
        this._conditions = conditions;

        if (items) {
            this._sitemapItems = items;
            this._preLoaded = true;
        }
    }

    /**
     * Get the site map items
     *
     * @returns {ITaxonomy[]}
     */
    public getSitemapItems(): ITaxonomy[] {
        return this._sitemapItems;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        if (this._preLoaded) {
            // Reset preloaded state, on the second load it should use build in caching mechanism of loadable object
            // This is only needed to prevent the initial http request to be executed
            this._preLoaded = false;
            this._setLoaded();
        } else {
            const url = Api.getTocItemsUrl(this._publicationId, this._parentId);
            let postBody: IPostConditionMap = {};
            for (let key in this._conditions) {
                if (this._conditions.hasOwnProperty(key)) {
                    postBody[key] = this._conditions[key].values;
                }
            }
            const body = `conditions=${JSON.stringify(postBody)}`;
            isEmpty(this._conditions)
                ? Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed))
                : Net.postRequest(url, body, "application/x-www-form-urlencoded", this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._sitemapItems = (JSON.parse(result) as ISitemapItem[]).map((item: ISitemapItem) => {
            return {
                id: item.Id,
                title: item.Title,
                url: item.Url,
                hasChildNodes: item.HasChildNodes
            } as ITaxonomy;
        });

        super._processLoadResult(result, webRequest);
    }
}
