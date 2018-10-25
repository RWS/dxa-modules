import { chain } from "lodash";
import { getPubForLang, getPubById } from "store/reducers/Reducer";
import { handleAction, combine } from "store/reducers/CombineReducers";
import { ICurrentLocationState } from "store/interfaces/State";
import { UPDATE_CURRENT_LOCATION, CHANGE_LANGUAGE } from "store/actions/Actions";
import { IPublication } from "interfaces/Publication";

const initailLocationState = (publicationId: string = "", pageId: string = "", taxonomyId: string = "", anchor: string = "") => ({
    publicationId,
    pageId,
    taxonomyId,
    anchor
});

const patchCurrentLocation = handleAction(
    UPDATE_CURRENT_LOCATION,
    (state: ICurrentLocationState, newLocation: ICurrentLocationState) => newLocation,
    initailLocationState()
);

const updateByLanguage = handleAction(
    CHANGE_LANGUAGE,
    (state: ICurrentLocationState, langauge: string, getState) => {
        const globalState = getState();
        return chain([state.publicationId])
            .map(pubId => getPubById(globalState, pubId))
            .map((publication: IPublication) => getPubForLang(globalState, publication, langauge))
            .map((publication: IPublication) => publication.id)
            .map(initailLocationState)
            .values()
            .value()[0];
    },
    initailLocationState()
);

export const currentLocation = combine(patchCurrentLocation, updateByLanguage);
