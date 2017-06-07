import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Page } from "models/Page";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/reducers/conditions/IConditions";
import { MD5 } from "object-hash";

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
     * @type { [key: string]: Page }
     */
    private PageModels: { [key: string]: Page } = {};

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page Id
     * @returns {Promise<IPage>} Promise to return the content
     *
     * @memberOf DataStoreClient
     */
    public getPageInfo(publicationId: string, pageId: string, conditions?: IConditionMap): Promise<IPage> {
        const page = this.getPageModel(publicationId, pageId, conditions);
        return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
            if (page.isLoaded()) {
                resolve(page.getPage());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(page.getPage());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
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

    private _getKey(...args: string[]): string {
        return args.join("/");
    }

    private getPageModel(publicationId: string, pageId: string, conditions?: IConditionMap): Page {
        const key = this._getKey(publicationId, pageId, MD5(conditions || "no-conditions"));
        if (!this.PageModels[key]) {
            this.PageModels[key] = new Page(publicationId, pageId, conditions);
        }
        return this.PageModels[key];
    }

}
