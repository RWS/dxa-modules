import { chain } from "lodash";
import { getPubForLang, getPubById } from "./Reducer";
import { handleAction, combine } from "./CombineReducers";
import { IPublicationCurrentState } from "store/interfaces/State";
import { UPDATE_CURRENT_PUBLICATION, CHANGE_LANGUAGE } from "store/actions/Actions";
import { IPublication } from "interfaces/Publication";

const initailPubState = (id: string = "") => ({
    publicationId: id,
    pageId: "",
    anchor: ""
});

const patchCurrentPulication = handleAction(
    UPDATE_CURRENT_PUBLICATION,
    (state: IPublicationCurrentState, newPublication: IPublicationCurrentState) => newPublication,
    initailPubState()
);

const updateByLanguage = handleAction(
    CHANGE_LANGUAGE,
    (state: IPublicationCurrentState, langauge: string, getState) => {
        const globalState = getState();
        const result = chain([state.publicationId])
               .map(pubId => getPubById(globalState, pubId))
               .map((publication: IPublication) => getPubForLang(globalState, publication, langauge))
               .map((publication: IPublication) => publication.id)
               .map(initailPubState)
               .first()
               .value();
        return result;
    },
    initailPubState()
);

export const publication = combine(patchCurrentPulication, updateByLanguage);