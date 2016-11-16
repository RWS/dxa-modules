import { path } from "utils/Path";
import { TcmId as TcmIdUtils } from "utils/TcmId";

import { IPage } from "interfaces/ServerModels";

// Global Catalina dependencies
import IWebRequest = SDL.Client.Net.IWebRequest;
import LoadableObject = SDL.Client.Models.LoadableObject;
import OO = SDL.Client.Types.OO;
import Net = SDL.Client.Net;

/**
 * Page info
 *
 * @export
 * @interface IPageInfo
 */
export interface IPageInfo {
    title: string;
    content: string;
}

/* tslint:disable-next-line */
eval(OO.enableCustomInheritance);
/**
 * Page model
 *
 * @export
 * @class Page
 * @extends {LoadableObject}
 */
export class Page extends LoadableObject {

    private _publicationId: string;
    private _pageId: string;
    private _page: IPage;

    /**
     * Creates an instance of Page.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     */
    constructor(publicationId: string, pageId: string) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
    }

    /**
     * Get the page info
     *
     * @returns {IPageInfo}
     */
    public getPageInfo(): IPageInfo {
        return {
            content: this._page.Html,
            title: this._page.Title
        };
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = path.getAbsolutePath(`gui/mocks/page-${TcmIdUtils.removeNamespace(this._pageId)}.json`);
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._page = JSON.parse(result);

        super._processLoadResult(result, webRequest);
    }

    protected _onLoadFailed(error: string, webRequest: IWebRequest): void {
        const p = this.properties;
        p.loading = false;
        this.fireEvent("loadfailed", { error: error });
    }
}

OO.createInterface("Sdl.DitaDelivery.Models.Page", Page);
