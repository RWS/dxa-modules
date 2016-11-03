import { routing } from "../global/client/RoutingClient";
import { localization } from "../services/client/LocalizationGlobalize";
import { ISitemapItem } from "../interfaces/ServerModels";
import { TcmId as TcmIdUtils } from "../utils/TcmId";

// Global Catalina dependencies
import IWebRequest = SDL.Client.Net.IWebRequest;
import LoadableObject = SDL.Client.Models.LoadableObject;
import OO = SDL.Client.Types.OO;
import Net = SDL.Client.Net;

/* tslint:disable-next-line */
eval(OO.enableCustomInheritance);
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
    private _sitemapItems: ISitemapItem[];

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
     * @returns {ISitemapItem[]}
     */
    public getSitemapItems(): ISitemapItem[] {
        return this._sitemapItems;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const taxonomyId = TcmIdUtils.getTaxonomyId(this._publicationId);

        if (!taxonomyId) {
            this._onLoadFailed(localization.formatMessage("error.path.not.found", [this._parentId, this._publicationId]));
        } else {
            const parentPart = `${TcmIdUtils.removeNamespace(taxonomyId)}-${TcmIdUtils.removeNamespace(this._parentId)}`;
            const url = routing.getAbsolutePath(`gui/mocks/toc-${parentPart}.json`);
            Net.getRequest(url, this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
        }
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._sitemapItems = JSON.parse(result);

        super._processLoadResult(result, webRequest);
    }

    protected _onLoadFailed(error: string, webRequest?: IWebRequest): void {
        const p = this.properties;
        p.loading = false;
        this.fireEvent("loadfailed", { error: error });
    }
}

OO.createInterface("Sdl.DitaDelivery.Models.Toc", Toc);
