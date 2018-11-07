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

import { combine, handleAction } from "store/reducers/CombineReducers";
import { DIALOG_REQUEST_CLOSE, CONDITIONS_EDITING_CHANGE} from "store/actions/Actions";
import { IConditionMap } from "store/interfaces/Conditions";

const emptyEditingConditions: IConditionMap = {};
const editingConditions = combine(
    handleAction(DIALOG_REQUEST_CLOSE, (state: IConditionMap) => emptyEditingConditions, emptyEditingConditions),
    handleAction(CONDITIONS_EDITING_CHANGE,
        (state: IConditionMap, newCondtions: IConditionMap) => {
            return {...state, ...newCondtions};
        }, emptyEditingConditions)
);

export const getConditions = (state: IConditionMap) => state;

export default editingConditions;
