import { IComment } from "interfaces/ServerModels";
import { COMMENTS_LOADED, COMMENTS_LOADING, COMMENTS_ERROR, COMMENT_SAVING, COMMENT_ERROR, COMMENT_SAVED, PAGE_LOADED } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "store/reducers/CombineReducers";
import { ICommentsPayload, ICommentsError, IComments, ICommentPayload, ICommentErrorsMap } from "store/interfaces/Comments";
import { cloneDeep } from "lodash";

export interface ICommentsErrorPayload {
    key: string;
    error: ICommentsError;
}

const removeByKey = (myObj: ICommentErrorsMap, deleteKey: string) => {
    return Object.keys(myObj)
        .filter(key => key !== deleteKey)
        .reduce((result: ICommentErrorsMap, current: string) => {
            result[current] = myObj[current];
            return result;
        }, {});
};

const byId = combine(
    handleAction(
        COMMENTS_LOADED,
        (state, { comments, key }) => {
            return { ...state, [key]: comments };
        },
        {}
    ),
    handleAction(
        COMMENT_SAVED,
        (state, { comment, key }) => {
            const stateComments = cloneDeep(state[key] as IComment[]);
            const parentItem = stateComments.find((c: IComment) => c.id == (comment as IComment).parentId) as IComment;
            if (parentItem) {
                parentItem.children = parentItem.children.concat(comment).sort((a: IComment, b: IComment) => b.id - a.id);
                return { ...state, [key]: stateComments };
            } else {
                return { ...state, [key]: stateComments.concat(comment).sort((a: IComment, b: IComment) => b.id - a.id) };
            }
        },
        {}
    )
);

const loading = combine(
    handleAction(COMMENTS_LOADING, (state: string[], key: string) => [...state, key], []),
    handleAction(COMMENTS_LOADED, (state: string[], { key }: ICommentsPayload) => state.filter(k => key !== k), []),
    handleAction(COMMENTS_ERROR, (state: string[], { key, error }: ICommentsErrorPayload) => state.filter(k => key !== k), [])
);

const saving = combine(
    handleAction(COMMENT_SAVING, (state: string[], key: string) => [...state, key], []),
    handleAction(COMMENT_SAVED, (state: string[], { key }: ICommentPayload) => state.filter(k => key !== k), []),
    handleAction(COMMENT_ERROR, (state: string[], { key }: ICommentErrorsMap) => state.filter(k => key !== k), [])
);

const errors = combine(
    handleAction(COMMENTS_ERROR, (state: ICommentErrorsMap, { key, error }: ICommentsErrorPayload) => Object.assign({}, state, { [key]: error.message }), {}),
    handleAction(COMMENTS_LOADED, (state: ICommentErrorsMap, { key }) => removeByKey(state, key), {})
);

const postErrors = combine(
    handleAction(COMMENT_ERROR, (state: ICommentErrorsMap, { key, error }: ICommentsErrorPayload) => Object.assign({}, state, { [key]: error.message }), {}),
    handleAction(COMMENT_SAVED, (state: ICommentErrorsMap, { key }) => removeByKey(state, key), {}),
    handleAction(PAGE_LOADED, (state: ICommentErrorsMap, { page }) => removeByKey(state, page.id), {})
);

export const comments = combineReducers({
    byId,
    loading,
    saving,
    errors,
    postErrors
});

export const getById = (state: IComments, id: string) => (id in state.byId ? state.byId[id] : [] as IComment[]);
export const getErrorMessage = (state: IComments, id: string): string => (id in state.errors ? state.errors[id] : "");
export const getPostErrorMessage = (state: IComments, id: string): string => (id in state.postErrors ? state.postErrors[id] : "");
export const isSaving = (state: IComments, id: string): boolean => state.saving.includes(id);
