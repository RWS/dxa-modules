import { isEmpty } from "lodash";
import { ISitemapItem } from "interfaces/ServerModels";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { Url } from "utils/Url";
import { localization } from "services/common/LocalizationService";
import { IConditionMap } from "store/reducers/conditions/IConditions";

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
        const body = `conditions=${JSON.stringify(this._conditions)}`;
        isEmpty(this._conditions)
            ? Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed))
            : Net.postRequest(url, body, "application/x-www-form-urlencoded", this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
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
            let parentId = navigationLinks[0].Id || "";
            let items: ISitemapItem[] = navigationLinks[0].Items;
            const getTaxonomyItems = (sitemapItems: ISitemapItem[]): { parentId: string, items: ITaxonomy[] } => {
                const children = sitemapItems.map(item => {
                    return {
                        id: item.Id,
                        title: item.Title,
                        url: item.Url,
                        hasChildNodes: item.HasChildNodes
                    };
                }) as ITaxonomy[];
                return {
                    parentId: parentId,
                    items: children
                };
            };
            this._pathWithSiblings = this._pathWithSiblings.concat(getTaxonomyItems(items));
            while (items && items.length > 0) {
                for (const item of items) {
                    if (item.Id && item.Id === this._taxonomyId) {
                        path.push({
                            id: item.Id,
                            title: item.Title,
                            url: item.Url,
                            hasChildNodes: item.HasChildNodes
                        });
                        return path;
                    }
                    // If there is a child which has child items the node is nested in a deeper level
                    // No need to loop over the entire collection
                    if (item.Items.length > 0) {
                        path.push({
                            id: item.Id,
                            title: item.Title,
                            url: item.Url,
                            hasChildNodes: item.HasChildNodes
                        });
                        parentId = item.Id || "";
                        items = item.Items;
                        this._pathWithSiblings = this._pathWithSiblings.concat(getTaxonomyItems(items));
                        break;
                    }
                }
            }
        }
        return path;
    }
}
