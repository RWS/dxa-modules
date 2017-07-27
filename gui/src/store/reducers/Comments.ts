import { IComment } from "interfaces/ServerModels";
import { COMMENTS_LOADED, COMMENTS_LOADING, COMMENTS_ERROR,
    COMMENT_SAVING, COMMENT_ERROR, COMMENT_SAVED, PAGE_LOADED } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "store/reducers/CombineReducers";
import { ICommentsPayload, ICommentsError, IComments, ICommentPayload , ICommentErrorsMap} from "store/interfaces/Comments";

export interface ICommentsErrorPayload {
    pageId: string;
    error: ICommentsError;
};

const removeByKey = (myObj: ICommentErrorsMap, deleteKey: string) => {
    return Object.keys(myObj)
        .filter(key => key !== deleteKey)
        .reduce((result: ICommentErrorsMap, current: string) => {
            result[current] = myObj[current];
            return result;
        }, {});
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
    handleAction(COMMENT_ERROR, (state: string[], { key }: ICommentErrorsMap) => state.filter((id) => id !== key), [])
);

const errors = combine(
    handleAction(COMMENTS_ERROR, (state: ICommentErrorsMap, { pageId, error }: ICommentsErrorPayload) => Object.assign({}, state, { [pageId]: error.message }), {}),
    handleAction(COMMENTS_LOADED, (state: ICommentErrorsMap, { pageId }) => removeByKey(state, pageId), {})
);

const postErrors = combine(
    handleAction(COMMENT_ERROR, (state: ICommentErrorsMap, { pageId, error }: ICommentsErrorPayload) => Object.assign({}, state, { [pageId]: error.message }), {}),
    handleAction(COMMENT_SAVED, (state: ICommentErrorsMap, { pageId }) => removeByKey(state, pageId), {}),
    handleAction(PAGE_LOADED, (state: ICommentErrorsMap, { page }) => removeByKey(state, page.id), {})
);

export const comments = combineReducers({
    byPageId,
    loading,
    saving,
    errors,
    postErrors
});

export const getByPageId = (state: IComments, pageId: string) => pageId in state.byPageId ? state.byPageId[pageId] : ([] as IComment[]);
export const getErrorMessage = (state: IComments, pageId: string): string => pageId in state.errors ? state.errors[pageId] : "";
export const getPostErrorMessage = (state: IComments, pageId: string): string => pageId in state.postErrors ? state.postErrors[pageId] : "";
export const isSaving = (state: IComments, pageId: string): boolean => state.saving.includes(pageId);
