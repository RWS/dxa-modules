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

    private _calculatePath(navigationLinks: ISitemapItem): ITaxonomy[] {
        const path: ITaxonomy[] = [];
        let items: ISitemapItem[] = navigationLinks.Items;
        if (navigationLinks.Id) {
            path.push({
                id: navigationLinks.Id,
                title: navigationLinks.Title,
                url: navigationLinks.Url,
                hasChildNodes: navigationLinks.HasChildNodes
            });
        }
        while (items && items.length > 0) {
            const firstItem = items[0];
            items = firstItem.Items;
            /* istanbul ignore else */
            if (firstItem.Id) {
                path.push({
                    id: firstItem.Id,
                    title: firstItem.Title,
                    url: firstItem.Url,
                    hasChildNodes: firstItem.HasChildNodes
                });
            }
        }
        return path;
    }
}
