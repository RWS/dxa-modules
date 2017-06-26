/**
 * Comment interface
 *
 * @export
 * @interface IComment
 */
export interface IComment {
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    id: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    namespaceId: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    itemPublicationId: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    itemId: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    itemType: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    score: number;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    status: number;
    /**
     *
     * @type {string}
     * @memberof IComment
     */
    creationDate: ICommentDate;
    /**
     *
     * @type {string}
     * @memberof IComment
     */
    lastModifiedDate: ICommentDate;
    /**
     *
     * @type {string}
     * @memberof IComment
     */
    content: string;
    /**
     *
     * @type {string}
     * @memberof IComment
     */
    moderator: string;
    /**
     *
     * @type {string}
     * @memberof IComment
     */
    moderatedDate: string;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    parentId: number;
    /**
     *
     * @type {IComment}
     * @memberof IComment
     */
    parent: IComment;
    /**
     *
     * @type {IComment[]}
     * @memberof IComment
     */
    children: IComment[];
    /**
     *
     * @type {IUser}
     * @memberof IComment
     */
    user: IUser;
    /**
     *
     * @type {number}
     * @memberof IComment
     */
    idLong: number;
}

export interface IUser {
    /**
     *
     * @type {number}
     * @memberof IUser
     */
    id: number;
    /**
     *
     * @type {string}
     * @memberof IUser
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof IUser
     */
    emailAddress: string;
    /**
     *
     * @type {string}
     * @memberof IUser
     */
    externalId: string;
}

export interface ICommentDate {
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    dayOfMonth: number;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    hour: number;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    minute: number;
    /**
     *
     * @type {string}
     * @memberof ICommentDate
     */
    month: string;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    monthValue: number;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    nano: number;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    second: number;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    year: number;
    /**
     *
     * @type {string}
     * @memberof ICommentDate
     */
    dayOfWeek: string;
    /**
     *
     * @type {number}
     * @memberof ICommentDate
     */
    dayOfYear: number;
}

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
