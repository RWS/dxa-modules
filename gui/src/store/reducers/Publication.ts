import { IPublication } from "interfaces/Publication";
import { IAction } from "store/interfaces/Action";
import { IPublicationState } from "store/interfaces/State";
import { handleActions, Reducer } from "redux-actions";
import { CHANGE_LANGUAGE, PUBLICATIONS_LOADED } from "store/actions/Actions";
import { getPubByLang } from "utils/Publication";
import { PUBLICATION_ROUTE_CHANGED } from "store/actions/Actions";

const DEFAULT_STATE: IPublicationState = {
    id: null,
    pageId: null,
    publications: []
};

type Pub = {
    publicationId: string;
    pageId: string;
};

export const publicationReducer = handleActions({
    [PUBLICATIONS_LOADED]: (state: IPublicationState, action: IAction) => ({
        ...state,
        publications: action.payload
    }),

    [CHANGE_LANGUAGE]: (state: IPublicationState, action: IAction): IPublicationState => {
        const newPub: IPublication | null = getPubByLang(state.publications)(state.id || "", action.payload as string);
        return newPub ? {
            ...state,
            id: newPub.id,
            pageId: null
        } : state;
    },

    [PUBLICATION_ROUTE_CHANGED]: (state: IPublicationState, action: IAction) => {
        // debugger;
        const payload = action.payload as Pub;
        return {
            ...state,
            id: payload.publicationId || state.id,
            pageId: payload.pageId || state.pageId
        };
    }
}, DEFAULT_STATE);

export { Reducer }
