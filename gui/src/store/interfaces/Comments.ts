import { IComment } from "interfaces/ServerModels";

export interface ICommentsMap {
    [key: string]: IComment;
}

export interface ICommentsPayload {
    key: string;
    comments: IComment[];
}

export interface ICommentPayload {
    key: string;
    comment: IComment;
}

export interface ICommentsError {
    message: string;
}

export interface ICommentErrorsMap {
    [key: string]: string;
}

export interface IComments {
    byId: { [key: string]: IComment[]};
    loading: string[];
    saving: string[];
    errors: ICommentErrorsMap;
    postErrors: ICommentErrorsMap;
}
