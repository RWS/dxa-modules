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

/* tslint:disable:no-any */

/**
 * Redux combineReducers with allowed global state for subreducers
 *
 * @param {any} reducers
 * @returns {Function}
 */
export const combineReducers = (reducers: any) => {
    const getState = (state: any, newState: any) => () => Object.freeze(Object.assign({}, state, newState));

    return (state: any, action: {}): {} => {
        const newState  = Object.keys(reducers)
            .reduce((currentState, reducerName) => {
                return Object.assign(currentState, {
                    [reducerName]: reducers[reducerName](state[reducerName], action, getState(state, currentState))
            });
        }, Object.create(null));
        return newState;
    };
};

/**
 * State action handler
 *
 * @param {string} type Action name
 * @param {Function} fn Action handler
 * @param {any} defaultState Action default state
 * @returns {Function}
 */
export const handleAction = (type: string, fn: (state: any, action: any, getState: () => any) => any, defaulState: any) => {
    return (state: any, action: any, getState: () => any) => {
        return action.type === type ? fn(state, action.payload, getState) : state;
    };
};

/**
 * Action handler combiner
 *
 * @param {any[]} handlers
 * @returns {Function}
 */
export const combine = (...handles: any[]) => (state: any, ...rest: any[]) => handles.reduce((prevState, reducer) => reducer(prevState, ...rest), state);
