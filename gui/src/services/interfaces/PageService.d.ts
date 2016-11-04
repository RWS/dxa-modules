import { IPageInfo } from "../../models/Page";
import { Promise } from "es6-promise";

/**
 * Page related services
 */
export interface IPageService {

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<IPageInfo>} Promise to return the the content
     *
     * @memberOf IDataStore
     */
    getPageInfo(publicationId: string, pageId: string): Promise<IPageInfo>;
}
