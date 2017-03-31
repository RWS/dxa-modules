import { handleAction, combineReducers } from "./CombineReducers";
import { RESLEASE_VERSIONS_LOADED } from "store/actions/Actions";
import { IProductReleaseVersionMap } from "store/interfaces/State";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IProductReleaseVersionState } from "../interfaces/State";

type Payload = {
    publicationId: string,
    releaseVersions: IProductReleaseVersion[]
};

const byPubId = handleAction(RESLEASE_VERSIONS_LOADED, (state: IProductReleaseVersionMap, payload: Payload) => {
    return { ...state, [payload.publicationId]: payload.releaseVersions };
}, {});

export const releaseVersions = combineReducers({
    byPubId
});

export const getReleaseVersionsForPub = (state: IProductReleaseVersionState, publicationId: string): IProductReleaseVersion[] => publicationId ? state.byPubId[publicationId] : [{title: "WTF?", value: "RRRRRR"}];