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
import { PagePresentation, IPageProps } from "./PagePresentation";
import { IState } from "store/interfaces/State";
import { getCurrentLocation, getPubById } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";
import { fetchPage } from "store/actions/Api";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => {
    const { publicationId, pageId: id, anchor } = getCurrentLocation(state);
    const pub = getPubById(state, publicationId);
    return {
        id,
        publicationId,
        direction: localization.getDirection(pub.language || state.language),
        anchor
    };
};

const mapDispatchToState = {
    fetchPage
};

/**
 * Connector of Page component for Redux
 *
 * @export
 */
export const Page = connect(mapStateToProps, mapDispatchToState)(PagePresentation);
