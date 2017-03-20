import { getPubByIdAndLang } from "./Reducer";
import { handleAction, combine } from "./CombineReducers";
import { IPublicationCurrentState } from "store/interfaces/State";
import { PUBLICATION_ROUTE_CHANGED, CHANGE_LANGUAGE } from "store/actions/Actions";

const initailPubState = (id: string = "") => ({
    publicationId: id,
    pageId: "",
    anchor: ""
});

const patchCurrentPulication = handleAction(
    PUBLICATION_ROUTE_CHANGED,
    (state: IPublicationCurrentState, newPublication: IPublicationCurrentState) => newPublication,
    initailPubState()
);

const updateByLanguage = handleAction(
    CHANGE_LANGUAGE,
    (state: IPublicationCurrentState, langauge: string, getState) => {
        const newPub = getPubByIdAndLang(getState(), state.publicationId, langauge);
        return initailPubState(newPub ? newPub.id : state.publicationId);
    },
    initailPubState()
);

export const publication = combine(patchCurrentPulication, updateByLanguage);