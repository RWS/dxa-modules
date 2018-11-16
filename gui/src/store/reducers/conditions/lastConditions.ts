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

import { ILastConditions, IConditionsPayload, IConditionMap } from "store/interfaces/Conditions";
import { handleAction } from "store/reducers/CombineReducers";
import { CONDITIONS_APPLY } from "store/actions/Actions";

const lastConditions = handleAction(CONDITIONS_APPLY,
        (state: ILastConditions, { pubId, conditions }: IConditionsPayload) => {
                const mergeLastChanged = Object.assign({}, state[pubId] || {}, conditions) as IConditionMap;
                return { ...state, [pubId]: mergeLastChanged };
        }, {});

export const getLastConditions = (state: ILastConditions, pubId: string) => pubId in state ? state[pubId] : ({} as IConditionMap);
export default lastConditions;
