import { ISitemapItem } from "interfaces/ServerModels";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "sdl-models";

/**
 * Navigation links model
 *
 * @export
 * @class NavigationLinks
 * @extends {LoadableObject}
 */
export class NavigationLinks extends LoadableObject {

    private _publicationId: string;
    private _taxonomyId: string;
    private _path: ITaxonomy[] = [];

    /**
     * Creates an instance of NavigationLinks.
     *
     * @param {string} publicationId Publication id
     * @param {string} taxonomyId Taxonomy id
     *
     * @memberOf NavigationLinks
     */
    constructor(publicationId: string, taxonomyId: string) {
        super();
        this._publicationId = publicationId;
        this._taxonomyId = taxonomyId;
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

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getNavigationLinksUrl(this._publicationId, this._taxonomyId);
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._path = this._calculatePath(JSON.parse(result));

        super._processLoadResult(result, webRequest);
    }

    private _calculatePath(navigationLinks: ISitemapItem[]): ITaxonomy[] {
        const path: ITaxonomy[] = [];
        if (navigationLinks && navigationLinks.length > 0) {
            let items: ISitemapItem[] = navigationLinks[0].Items;
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
                        items = item.Items;
                        break;
                    }
                }
            }
        }
        return path;
    }
}
