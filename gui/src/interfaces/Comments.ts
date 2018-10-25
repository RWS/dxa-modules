export interface IPostComment {
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    publicationId: string;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    publicationTitle: string | undefined;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    publicationUrl: string;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    pageTitle: string | undefined;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    pageId: string;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    pageUrl: string;
    /**
     *
     * @type {string}
     * @memberof IPostComment
     */
    username: string;
    /**
     *
     * @type {string}
     * @memberof IPostComment
     */
    email: string;
    /**
     *
     * @type {string}
     * @memberof IPostComment
     */
    content: string;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    parentId: number;
    /**
     *
     * @type {number}
     * @memberof IPostComment
     */
    language: string;
}
