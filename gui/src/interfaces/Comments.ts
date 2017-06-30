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
    pageId: string;
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
}
