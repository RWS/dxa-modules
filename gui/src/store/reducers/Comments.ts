import { IComment } from "interfaces/Comments";
import { COMMENTS_LOADED, COMMENTS_LOADING, COMMENTS_ERROR, COMMENT_SAVING, COMMENT_ERROR, COMMENT_SAVED } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "./CombineReducers";
import { ICommentsPayload, ICommentsError, IComments, ICommentPayload } from "store/interfaces/Comments";

export interface ICommentsErrorPayload {
    pageId: string;
    error: ICommentsError;
};

const byPageId = combine(
    handleAction(COMMENTS_LOADED, (state, { comments, pageId }) => {
        return ({ ...state, [pageId]: comments });
    }, {}),
    handleAction(COMMENT_SAVED, (state, { comment, pageId }) => {
        return ({ ...state, [pageId]: state[pageId].concat(comment).sort((a: IComment, b: IComment) => b.id - a.id) });
    }, {})
);

const loading = combine(
    handleAction(COMMENTS_LOADING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(COMMENTS_LOADED, (state: string[], { pageId }: ICommentsPayload) => state.filter((id) => id !== pageId), []),
    handleAction(COMMENTS_ERROR, (state: string[], { pageId, error }: ICommentsErrorPayload) => state.filter((id) => id !== pageId), [])
);

const saving = combine(
    handleAction(COMMENT_SAVING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(COMMENT_SAVED, (state: string[], { pageId }: ICommentPayload) => state.filter((id) => id !== pageId), []),
    handleAction(COMMENT_ERROR, (state: string[], { pageId, error }: ICommentsErrorPayload) => state.filter((id) => id !== pageId), [])
);

const errors = combine(
    handleAction(COMMENTS_ERROR, () => [], []),
    handleAction(COMMENT_ERROR, (state: string[], { pageId, error }: ICommentsErrorPayload) => Object.assign({}, state, { [pageId]: error.message }), {})
);

export const comments = combineReducers({
    byPageId,
    loading,
    saving,
    errors
});

export const getByPageId = (state: IComments, pageId: string) => pageId in state.byPageId ? state.byPageId[pageId] : ([] as IComment[]);
export const getErrorMessage = (state: IComments, pageId: string): string => pageId in state.errors ? state.errors[pageId] : "";
