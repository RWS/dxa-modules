import { IPostComment } from "interfaces/Comments";
import { IComment } from "interfaces/ServerModels";
import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Page } from "models/Page";
import { PageIdByLogicalId } from "models/PageIdByLogicalId";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";
import { MD5 } from "object-hash";
import { Comments } from "models/Comments";
import { Comment } from "models/Comment";
import { localization } from "services/common/LocalizationService";

/**
 * Page service, interacts with the models to fetch the required data.
 *
 * @export
 * @class PageService
 * @implements {ITaxonomyService}
 */
export class PageService implements IPageService {
    /**
     * Table of Comments models
     *
     * @protected
     * @static
     * @type {{ [key: string]: Comments }}
     */
    protected static CommentsModels: { [key: string]: Comments | undefined };

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

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} logicalId The page logical Id
     * @returns {Promise<IPage>} Promise to return the content
     *
     * @memberOf DataStoreClient
     */
    public getPageInfoByLogicalId(
        publicationId: string,
        logicalId: string,
        conditions?: IConditionMap
    ): Promise<IPage> {
        // We don`t need to add this to the models list, as once its loaded, page would be available by Logical Id
        const pageIdByLogicalId = new PageIdByLogicalId(publicationId, logicalId);
        return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                const pageId = pageIdByLogicalId.getPageId();
                if (pageId) {
                    this.getPageInfo(publicationId, pageIdByLogicalId.getPageId(), conditions).then(resolve, reject);
                } else {
                    reject(localization.formatMessage("error.page.not.found", [pageId]));
                }
            };
            const onLoadFailed = (event: Event & { data: { error: string } }) => {
                removeEventListeners();
                reject(event.data.error);
            };
            removeEventListeners = (): void => {
                pageIdByLogicalId.removeEventListener("load", onLoad);
                pageIdByLogicalId.removeEventListener("loadfailed", onLoadFailed);
            };

            pageIdByLogicalId.addEventListener("load", onLoad);
            pageIdByLogicalId.addEventListener("loadfailed", onLoadFailed);
            pageIdByLogicalId.load();
        });
    }

    /**
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {boolean} descending
     * @param {number} top
     * @param {number} skip
     * @param {number[]} status
     * @returns {Promise<IComment[]>}
     *
     * @memberof PageService
     */
    public getComments(
        publicationId: string,
        pageId: string,
        descending: boolean,
        top: number,
        skip: number,
        status: number[]
    ): Promise<IComment[]> {
        const comments = this.getCommentsModel(publicationId, pageId, descending, top, skip, status);

        return new Promise((resolve: (items?: IComment[]) => void, reject: (error: string | null) => void) => {
            if (comments.isLoaded()) {
                resolve(comments.getComments());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(comments.getComments());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    comments.removeEventListener("load", onLoad);
                    comments.removeEventListener("loadfailed", onLoadFailed);
                };

                comments.addEventListener("load", onLoad);
                comments.addEventListener("loadfailed", onLoadFailed);
                comments.load();
            }
        });
    }

    /**
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {IComment} commentData
     * @returns {Promise<IComment>}
     *
     * @memberof PageService
     */
    public saveComment(commentData: IPostComment): Promise<IComment> {
        // We need this list to invalidate the date further. So far only pubId and pageId combination is used as key
        const comments = this.getCommentsModel(commentData.publicationId, commentData.pageId, false, 0, 0, []);
        const comment = new Comment(commentData);
        return new Promise((resolve: (data?: IComment) => void, reject: (error: string | null) => void) => {
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                comments.unload();
                resolve(comment.getComment());
            };
            const onLoadFailed = (event: Event & { data: { error: string } }) => {
                removeEventListeners();
                reject(event.data.error);
            };
            removeEventListeners = (): void => {
                comment.removeEventListener("load", onLoad);
                comment.removeEventListener("loadfailed", onLoadFailed);
                comment.removeEventListener("validatefailed", onLoadFailed);

                // There is no further componen processing, so we don`t need to keep this component in mermory.
                comment.dispose();
            };

            comment.addEventListener("load", onLoad);
            comment.addEventListener("loadfailed", onLoadFailed);
            comment.addEventListener("validatefailed", onLoadFailed);
            comment.save();
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

    private getCommentsModel(
        publicationId: string,
        pageId: string,
        descending: boolean,
        top: number,
        skip: number,
        status: number[]
    ): Comments {
        const key = this._getKey(publicationId, pageId);
        this.ensureCommentsModel(key);

        if (!PageService.CommentsModels[key]) {
            PageService.CommentsModels[key] = new Comments(publicationId, pageId, descending, top, skip, status);
        }

        return PageService.CommentsModels[key] as Comments;
    }

    private ensureCommentsModel(key: string): void {
        if (!PageService.CommentsModels) {
            PageService.CommentsModels = {};
        }

        if (!PageService.CommentsModels[key]) {
            PageService.CommentsModels[key] = undefined;
        }
    }
}
