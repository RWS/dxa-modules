import { IPage } from "interfaces/Page";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";

/**
 * Page related services
 */
export interface IPageService {

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page id
     * @returns {Promise<IPage>} Promise to return the the content
     *
     * @memberOf IDataStore
     */
    getPageInfo(publicationId: string, pageId: string, conditions: IConditionMap): Promise<IPage>;
}
