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
// TODO: Remove this library
import { StorageAdapter, AdapterCallback } from "redux-localstorage";

// tslint:disable-next-line:no-any
type LocalGenericObject = { [key: string]: any };

/**
 * getStateSubset returns an part of the state by provided paths subset
 *
 * @param {IState} state The state.
 * @param {String[]} paths Paths array.
 *
 * @returns {Object} Subset from state
 */
const getStateSubset = (state: IState, paths: string[]): Object => {
    let subset = {};

    paths.forEach((path: string) => {
        const subPathsSet = path.split("."),
            length = subPathsSet.length;

        let tmpState: LocalGenericObject = state,
            tmpSubset: LocalGenericObject = subset,
            tmpSubPath = null,
            idx: number = 0;

        while ((tmpSubPath = subPathsSet[idx++])) {
            tmpState = tmpState[tmpSubPath];

            if (!tmpState) {
                return;
            }

            if (idx === length) {
                tmpSubset[tmpSubPath] = tmpState;
            } else if (!tmpSubset[tmpSubPath]) {
                tmpSubset[tmpSubPath] = {};
            }

            tmpSubset = tmpSubset[tmpSubPath];
        }
    });

    return subset;
};

export const localStorageFilter = (path: string[]) => {
    return (storage: StorageAdapter<Storage>) =>
        Object.assign({}, storage, {
            put: (key: string, state: IState, callback: AdapterCallback) => {
                storage.put(key, getStateSubset(state, path), callback);
            }
        });
};
