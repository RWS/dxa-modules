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

import { chain } from "lodash";
import { getPubForLang, getPubById } from "store/reducers/Reducer";
import { handleAction, combine } from "store/reducers/CombineReducers";
import { ICurrentLocationState } from "store/interfaces/State";
import { UPDATE_CURRENT_LOCATION, CHANGE_LANGUAGE } from "store/actions/Actions";
import { IPublication } from "interfaces/Publication";

const initailLocationState = (publicationId: string = "", pageId: string = "", taxonomyId: string = "", anchor: string = "") => ({
    publicationId,
    pageId,
    taxonomyId,
    anchor
});

const patchCurrentLocation = handleAction(
    UPDATE_CURRENT_LOCATION,
    (state: ICurrentLocationState, newLocation: ICurrentLocationState) => newLocation,
    initailLocationState()
);

const updateByLanguage = handleAction(
    CHANGE_LANGUAGE,
    (state: ICurrentLocationState, langauge: string, getState) => {
        const globalState = getState();
        return chain([state.publicationId])
            .map(pubId => getPubById(globalState, pubId))
            .map((publication: IPublication) => getPubForLang(globalState, publication, langauge))
            .map((publication: IPublication) => publication.id)
            .map(initailLocationState)
            .values()
            .value()[0];
    },
    initailLocationState()
);

export const currentLocation = combine(patchCurrentLocation, updateByLanguage);
