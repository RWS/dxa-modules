import { IComment } from "interfaces/Comments";
import { COMMENTS_LOADED, COMMENTS_LOADING, COMMENTS_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "./CombineReducers";
import { ICommentsPayload, ICommentsError, IComments } from "store/interfaces/Comments";

export interface ICommentsErrorPayload {
    pageId: string;
    error: ICommentsError;
};

const byPageId = combine(
    handleAction(COMMENTS_LOADED, (state, { comments, pageId }) => {
        return ({ ...state, [pageId]: comments });
    }, {})
);

const loading = combine(
    handleAction(COMMENTS_LOADING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(COMMENTS_LOADED, (state: string[], { pageId }: ICommentsPayload) => state.filter((id) => id !== pageId), []),
    handleAction(COMMENTS_ERROR, (state: string[], { pageId, error }: ICommentsErrorPayload) => state.filter((id) => id !== pageId), [])
);

const errors = handleAction(COMMENTS_ERROR, () => [], []);

export const comments = combineReducers({
    byPageId,
    loading,
    errors
});

export const getByPageId = (state: IComments, pageId: string) => pageId in state.byPageId ? state.byPageId[pageId] : ([] as IComment[]);
