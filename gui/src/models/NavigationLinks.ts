import { path } from "../utils/Path";
import { ISitemapItem } from "../interfaces/ServerModels";

// Global Catalina dependencies
import IWebRequest = SDL.Client.Net.IWebRequest;
import LoadableObject = SDL.Client.Models.LoadableObject;
import OO = SDL.Client.Types.OO;
import Net = SDL.Client.Net;

/**
 * Link info
 *
 * @export
 * @interface ILinkInfo
 */
export interface ILinkInfo {
    Id?: string;
    Title: string;
    Url?: string;
}

/* tslint:disable-next-line */
eval(OO.enableCustomInheritance);
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
    private _path: ILinkInfo[] = [];

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
     * @returns {ILinkInfo[]} Ids of ancestors
     *
     * @memberOf NavigationLinks
     */
    public getPath(): ILinkInfo[] {
        return this._path;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = path.getAbsolutePath(`gui/mocks/navigation-${this._publicationId}-${this._taxonomyId}.json`);
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._path = this._calculatePath(JSON.parse(result));

        super._processLoadResult(result, webRequest);
    }

    protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
        const p = this.properties;
        p.loading = false;
        this.fireEvent("loadfailed", { error: error });
    }

    private _calculatePath(navigationLinks: ISitemapItem): ILinkInfo[] {
        const path: ILinkInfo[] = [];
        let items: ISitemapItem[] = navigationLinks.Items;
        if (navigationLinks.Id) {
            path.push(navigationLinks as ILinkInfo);
        }
        while (items && items.length > 0) {
            const firstItem = items[0];
            items = firstItem.Items;
            /* istanbul ignore else */
            if (firstItem.Id) {
                path.push(navigationLinks as ILinkInfo);
            }
        }
        return path;
    }
}

OO.createInterface("Sdl.DitaDelivery.Models.NavigationLinks", NavigationLinks);
