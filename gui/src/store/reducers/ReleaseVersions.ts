/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { handleAction, combineReducers } from "store/reducers/CombineReducers";
import { RELEASE_VERSIONS_LOADED } from "store/actions/Actions";
import { IProductReleaseVersionMap, IProductReleaseVersionState } from "store/interfaces/State";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION } from "models/Publications";
import { localization } from "services/common/LocalizationService";
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

export const translateProductReleaseVersion = (productReleaseVersion: string): string =>
    String.normalize(productReleaseVersion) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)
        ? localization.formatMessage("productreleaseversions.unknown.title")
        : productReleaseVersion;

export const translateProductReleaseVersions = (versions: IProductReleaseVersion[]): IProductReleaseVersion[] => {
    return versions && versions.map(version => {
        let { title } = version;

        if (String.normalize(version.value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)) {
            title = localization.formatMessage("productreleaseversions.unknown.title");
        };

        return { ...version, title };
    });
};
