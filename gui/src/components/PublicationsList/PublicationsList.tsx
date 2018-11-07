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

import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import {
    isPubsLoading,
    getPubListErrorMessage,
    getReleaseVersionsForPub,
    normalizeProductFamily,
    normalizeProductReleaseVersion,
    translateProductReleaseVersions,
    getPubListRepresentatives
} from "store/reducers/Reducer";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";
import { PublicationsListPresentation, IPublicationsListProps } from "@sdl/dd/PublicationsList/PublicationsListPresentation";

const mapStateToProps = (state: IState, ownProps: IPublicationsListProps) => {
    const { params } = ownProps;
    const error = getPubListErrorMessage(state);
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    let filter = { productFamily: normalizeProductFamily(params) };

    const publications = getPubListRepresentatives(
        state,
        selectedProductVersion ? { ...filter, productReleaseVersion: normalizeProductReleaseVersion(selectedProductVersion) } : filter
    );

    return {
        error,
        publications,
        productReleaseVersions: translateProductReleaseVersions(productReleaseVersions),
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state),
        selectedProductVersion,
        uiLanguage: state.language
    };
};

const dispatchToProps = {
    fetchProductReleaseVersionsByProductFamily
};

/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const PublicationsList = connect(mapStateToProps, dispatchToProps)(PublicationsListPresentation);
