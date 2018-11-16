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

import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogOpen, dialogClose, applyConditions, updateEditingConditions } from "store/actions/Actions";
import { getCurrentLocation, isConditionsDialogVisible, getAllConditionsByPubId, getEditingConditions, getLastConditions } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentLocation(state);
    const editingConditions = getEditingConditions(state);
    return {
        pubId,
        isOpen: isConditionsDialogVisible(state),
        allConditions: getAllConditionsByPubId(state, pubId),
        editingConditions: !isEmpty(editingConditions) ? editingConditions : getLastConditions(state, pubId)
    };
};

const mapDispatchToState = {
    open: dialogOpen,
    close: dialogClose,
    apply: applyConditions,
    change: updateEditingConditions
};

export const ConditionsDialog = connect(
    mapStateToProps,
    mapDispatchToState
)(ConditionsDialogPresentation);
