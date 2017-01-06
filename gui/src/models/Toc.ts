import { ISitemapItem } from "interfaces/ServerModels";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Api } from "utils/Api";
import { getRequest, IWebRequest, LoadableObject } from "sdl-models";

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
    private _sitemapItems: ITaxonomy[];

    /**
     * Creates an instance of Toc.
     *
     * @param {string} publicationId Publication id
     * @param {string} parentId Parent sitemap item id, for the root item pass "root" as the parent id.
     */
    constructor(publicationId: string, parentId: string) {
        super();
        this._publicationId = publicationId;
        this._parentId = parentId;
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
        const url = Api.getTocItemsUrl(this._publicationId, this._parentId);
        getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
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
