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

export interface ICondition {
    values: string[];
    datatype: "Date" | "Text";
    range: boolean;
}

export interface IConditionMap {
    [key: string]: ICondition;
}

export interface IPostConditions {
    [key: string]: string[];
}

export interface IPostConditionRequest {
    publicationId: number;
    userConditions: IPostConditions;
}

export interface IConditionsPayload {
    pubId: string;
    conditions: IConditionMap;
}

export interface IAllConditions {
        byPubId: { [pubId: string]: IConditionMap};
        loading: string[];
        errors: { [pubId: string]: string };
}

export interface ILastConditions {
    [pubId: string]: IConditionMap;
}

export interface IConditionsState {
    showDialog: boolean;
    allConditions: IAllConditions;
    lastConditions: ILastConditions;
    editingConditions: IConditionMap;
}
