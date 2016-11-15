import { IPageService } from "services/interfaces/PageService";
import { Page, IPageInfo } from "models/Page";
import { Promise } from "es6-promise";

/**
 * Page service, interacts with the models to fetch the required data.
 *
 * @export
 * @class PageService
 * @implements {ITaxonomyService}
 */
export class PageService implements IPageService {

    /**
     * Page models
     *
     * @private
     * @static
     * @type {{ [publicationId: string]: {  [pageId: string]: Page } }}
     */
    private static PageModels: { [publicationId: string]: { [pageId: string]: Page } };

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page Id
     * @returns {Promise<IPageInfo>} Promise to return the content
     *
     * @memberOf DataStoreClient
     */
    public getPageInfo(publicationId: string, pageId: string): Promise<IPageInfo> {
        const page = this.getPageModel(publicationId, pageId);
        return new Promise((resolve: (info?: IPageInfo) => void, reject: (error: string | null) => void) => {
            if (page.isLoaded()) {
                resolve(page.getPageInfo());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(page.getPageInfo());
                };
                const onLoadFailed = (event: SDL.Client.Event.Event) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    page.removeEventListener("load", onLoad);
                    page.removeEventListener("loadfailed", onLoadFailed);
                };

                page.addEventListener("load", onLoad);
                page.addEventListener("loadfailed", onLoadFailed);
                page.load();
            }
        });
    }

    private getPageModel(publicationId: string, pageId: string): Page {
        if (!PageService.PageModels) {
            PageService.PageModels = {};
        }
        if (!PageService.PageModels[publicationId]) {
            PageService.PageModels[publicationId] = {};
        }
        if (!PageService.PageModels[publicationId][pageId]) {
            PageService.PageModels[publicationId][pageId] = new Page(publicationId, pageId);
        }
        return PageService.PageModels[publicationId][pageId];
    }

}
