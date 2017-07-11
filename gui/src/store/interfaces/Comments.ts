import { IComment } from "interfaces/ServerModels";

export interface ICommentsMap {
    [key: string]: IComment;
}

export interface ICommentsPayload {
    pageId: string;
    comments: IComment[];
}

export interface ICommentPayload {
    pageId: string;
    comment: IComment;
}

export interface ICommentsError {
    message: string;
}

export interface ICommentErrorsMap {
    [pageId: string]: string;
}

export interface IComments {
    byPageId: { [pageId: string]: IComment[]};
    loading: string[];
    saving: string[];
    errors: ICommentErrorsMap;
    postErrors: ICommentErrorsMap;
}
