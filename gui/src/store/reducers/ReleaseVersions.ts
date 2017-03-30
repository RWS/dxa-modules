import { handleAction, combineReducers } from "./CombineReducers";
import { RELEASE_VERSIONS_LOADED } from "store/actions/Actions";
import { IProductReleaseVersionMap } from "store/interfaces/State";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IProductReleaseVersionState } from "../interfaces/State";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";
import { String } from "utils/String";

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
    productFamily ? state.byProductFamily[productFamily] : [{title: DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, value: String.normalize(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE)}];