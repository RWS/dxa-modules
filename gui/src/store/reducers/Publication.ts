import { getPubByIdAndLang } from "./Reducer";
import { handleAction, combine } from "./combineReducers";
import { IPublicationCurrentState } from "store/interfaces/State";
import { PUBLICATION_ROUTE_CHANGED, CHANGE_LANGUAGE } from "store/actions/Actions";

const DEFAULT_STATE: IPublicationCurrentState = {
    publicationId: "",
    pageId: ""
};

const patchCurrentPulication = handleAction(
    PUBLICATION_ROUTE_CHANGED,
    (state: IPublicationCurrentState, newPublication: IPublicationCurrentState) => newPublication,
    DEFAULT_STATE
);

const updateByLanguage = handleAction(
    CHANGE_LANGUAGE,
    (state: IPublicationCurrentState, langauge: string, getState) => {
        const newPub = getPubByIdAndLang(getState(), state.publicationId, langauge);
        return {
            publicationId: newPub ? newPub.id : state.publicationId,
            pageId: ""
        };
    },
    DEFAULT_STATE
);

export const publication = combine(patchCurrentPulication, updateByLanguage);