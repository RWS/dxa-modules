import { IComment } from "interfaces/Comments";
import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";

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
        info: IPage;
    } = {
        error: null,
        info: {
            id: "12345",
            content: "<span>Page content!</span>",
            title: "Page title!",
            sitemapIds: null
        }
    };

    private _mockDataComments: {
        error: string | null;
        values: IComment[];
    } = {
        error: null,
        values: []
    };

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<IPage>} Promise to return the the content
     *
     * @memberOf DataStoreServer
     */
    public getPageInfo(publicationId: string, pageId: string, conditions: IConditionMap = {}): Promise<IPage> {
        const { error, info } = this._mockDataPage;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(info);
        }
    }

    public getComments(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): Promise<IComment[]> {
        const { error, values } = this._mockDataComments;
        if (error) {
            return Promise.reject(error);
        } else {
            return Promise.resolve(values);
        }
    }

}
