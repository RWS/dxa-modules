import { IPageService } from "../interfaces/PageService";
import { IPageInfo } from "../../models/Page";
import { Promise } from "es6-promise";

/**
 * Page service for the server.
 *
 * @export
 * @class PageService
 * @implements {IPageService}
 */
export class PageService implements IPageService {

    private _mockDataPage: {
        error: string | null;
        info: IPageInfo;
    } = {
        error: null,
        info: {
            content: "<span>Page content!</span>",
            title: "Page title!"
        }
    };

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<IPageInfo>} Promise to return the the content
     *
     * @memberOf DataStoreServer
     */
    public getPageInfo(publicationId: string, pageId: string): Promise<IPageInfo> {
        const { error, info } = this._mockDataPage;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(info);
        }
    }

}
