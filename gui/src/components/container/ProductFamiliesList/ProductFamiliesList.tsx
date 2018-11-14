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
import { isPubsLoading, getPubListErrorMessage } from "store/reducers/Reducer";
import { fetchProductFamilies } from "store/actions/Api";
import { ProductFamiliesListPresentation } from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesListPresentation";

const mapStateToProps = (state: IState) => {
    const error = getPubListErrorMessage(state);
    const productFamilies = state.productFamilies;

    return {
        error: error,
        productFamilies,
        isLoading: productFamilies.length === 0 && isPubsLoading(state)
    };
};

const dispatchToProps = {
    fetchProductFamilies
};

/**
 * Connector of Product families List component for Redux
 *
 * @export
 */
export const ProductFamiliesList = connect(mapStateToProps, dispatchToProps)(ProductFamiliesListPresentation);
