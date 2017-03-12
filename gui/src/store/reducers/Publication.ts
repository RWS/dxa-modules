import { IPublicationCurrentState } from "store/interfaces/State";
import { PUBLICATION_ROUTE_CHANGED } from "store/actions/Actions";
import { handleAction, combine } from "./combineReducers";
import { CHANGE_LANGUAGE } from "../actions/Actions";
import { getPubByLang } from "./Reducer";

const DEFAULT_STATE: IPublicationCurrentState = {
    publicationId: "",
    pageId: ""
};

const patchCurrentPulication = handleAction(PUBLICATION_ROUTE_CHANGED,
     (state: IPublicationCurrentState, newPublication: IPublicationCurrentState) => newPublication, 
     DEFAULT_STATE
);

const updateByLanguage = handleAction(CHANGE_LANGUAGE,
    (state: IPublicationCurrentState, langauge: string, getState) => {
        const newPub = getPubByLang(getState(), state.publicationId, langauge);
        return {
            publicationId: newPub ? newPub.id : state.publicationId,
            pageId: ""
        };
    }, 
    DEFAULT_STATE);

export const publication = combine(patchCurrentPulication, updateByLanguage);