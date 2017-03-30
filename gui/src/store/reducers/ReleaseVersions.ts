import { handleAction, combineReducers } from "./CombineReducers";
import { RELEASE_VERSIONS_LOADED } from "store/actions/Actions";
import { IProductReleaseVersionMap } from "store/interfaces/State";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IProductReleaseVersionState } from "../interfaces/State";

type Payload = {
    productFamily: string,
    releaseVersions: IProductReleaseVersion[]
};

const byProductFamily = handleAction(RELEASE_VERSIONS_LOADED, (state: IProductReleaseVersionMap, payload: Payload) => {
    return { ...state, [payload.productFamily]: payload.releaseVersions };
}, {});

export const releaseVersions = combineReducers({
    byProductFamily
});

export const getReleaseVersionsForPub = (state: IProductReleaseVersionState, productFamily: string): IProductReleaseVersion[] =>
    productFamily ? state.byProductFamily[productFamily] : [{title: "WTF?", value: "RRRRRR"}];