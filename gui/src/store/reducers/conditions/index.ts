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

import { combineReducers } from "store/reducers/CombineReducers";
import { IConditionsState, IConditionMap } from "store/interfaces/Conditions";

import showDialog, * as ShowDialog from "./showDialog";
import allConditions, * as AllConditions from "./allConditions";
import lastConditions, * as LastConditions from "./lastConditions";
import editingConditions, * as EditingConditions from "./editingConditions";

const conditions = combineReducers({
    showDialog,
    allConditions,
    lastConditions,
    editingConditions
});

export default conditions;
export const isDialogVisible = (state: IConditionsState) => ShowDialog.isVisible(state.showDialog);
export const getAllByPubId = (state: IConditionsState, pubId: string): IConditionMap => AllConditions.getByPubId(state.allConditions, pubId);
export const getLastConditions = (state: IConditionsState, pubId: string): IConditionMap => LastConditions.getLastConditions(state.lastConditions, pubId);
export const getEditingConditions = (state: IConditionsState) => EditingConditions.getConditions(state.editingConditions);
