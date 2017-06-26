import { IComment, IPostComment } from "interfaces/Comments";
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

    /**
     * Get comments of page
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {boolean} descending
     * @param {number} top
     * @param {number} skip
     * @param {number[]} status
     * @returns {Promise<IComment[]>}
     *
     * @memberof IPageService
     */
    getComments(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): Promise<IComment[]>;

    /**
     * Save page comment
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {IComment} comment
     * @returns {Promise<IComment>}
     *
     * @memberof IPageService
     */
    saveComment(comment: IPostComment): Promise<IComment>;
}
