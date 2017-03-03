import { IAction } from "store/interfaces/Action";
import { IPublicationState } from "store/interfaces/State";
import { handleActions, Reducer } from "redux-actions";
import { CHANGE_LANGUAGE, PUBLICATIONS_LOADED } from "store/actions/Actions";
import { getPubByLang } from "utils/Publication";

const DEFAULT_STATE: IPublicationState = {
    id: null,
    pageId: null,
    publications: []
};

export const publicationReducer = handleActions({
    [PUBLICATIONS_LOADED]: (state: IPublicationState, action: IAction) => ({
        id: state.id,
        pageId: state.pageId,
        publications: action.payload
    }),

    [CHANGE_LANGUAGE]: (state: IPublicationState, action: IAction) => ({
        id: getPubByLang(state.publications)(state.id || "", action.payload as string).id,
        pageId: null,
        publications: state.publications
    })
}, DEFAULT_STATE);

export { Reducer }
