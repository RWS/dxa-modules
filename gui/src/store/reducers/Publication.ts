import { IPublication } from "interfaces/Publication";
import { IAction } from "store/interfaces/Action";
import { IPublicationState } from "store/interfaces/State";
import { handleActions, Reducer } from "redux-actions";
import { CHANGE_LANGUAGE, PUBLICATIONS_LOADED } from "store/actions/Actions";
import { getPubByLang } from "utils/Publication";
import { PUBLICATION_ROUTE_CHANGED } from "store/actions/Actions";
import { IPublication as IPublicationParams } from "components/container/RouteStateSync";

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

    [CHANGE_LANGUAGE]: function (state: IPublicationState, action: IAction) {
        const newPub: IPublication | null = getPubByLang(state.publications)(state.id || "", action.payload as string);
        return newPub ? {
            id: newPub.id,
            pageId: null,
            publications: state.publications.slice()
        } : state
    },

    [PUBLICATION_ROUTE_CHANGED]: (state: IPublicationState, action: IAction) => {
        // debugger;
        const payload = action.payload as IPublicationParams;
        return {
            id: payload.publicationId || state.id,
            pageId: payload.pageId || state.pageId,
            publications: state.publications.slice()
        };
    }
}, DEFAULT_STATE);

export { Reducer }
