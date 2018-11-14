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

import { combineReducers, handleAction, combine } from "store/reducers/CombineReducers";
import { IPage } from "interfaces/Page";
import { dummyPage } from "utils/Page";
import { PAGE_LOADED, PAGE_LOADING, PAGE_ERROR } from "store/actions/Actions";
import { IPagesMap, IPageState, IPageErrorsMap } from "store/interfaces/State";

interface IPageLoadedPayload {
    page: IPage;
    key: string;
}

const removeByKey = (myObj: IPageErrorsMap, deleteKey: string) => {
    return Object.keys(myObj)
        .filter(key => key !== deleteKey)
        .reduce((result: IPageErrorsMap, current) => {
            result[current] = myObj[current];
            return result;
        }, {});
};

const byId = handleAction(
    PAGE_LOADED,
    (state: IPageState, { page, key }: IPageLoadedPayload): IPagesMap => Object.assign({}, state, { [key]: page }),
    {}
);

const loading = combine(
    handleAction(PAGE_LOADING, (state: string[], pageId: string) => [...state, pageId], []),
    handleAction(PAGE_LOADED, (state: string[], { key }: IPageLoadedPayload) => state.filter(id => id !== key), []),
    handleAction(PAGE_ERROR, (state: string[], { key }: IPageErrorsMap) => state.filter(id => id !== key), [])
);

const errors = combine(
    handleAction(
        PAGE_ERROR,
        (state: IPageErrorsMap, error) => Object.assign({}, state, { [error.key]: error.message }),
        {}
    ),
    handleAction(PAGE_LOADING, (state: IPageErrorsMap, pageId: string) => removeByKey(state, pageId), {})
);

export const pages = combineReducers({
    byId,
    loading,
    errors
});

// Selectors
export const getPageById = (state: IPageState, id: string): IPage => {
    return id in state.byId ? state.byId[id] : dummyPage(id);
};
export const getErrorMessage = (state: IPageState, id: string): string => (id in state.errors ? state.errors[id] : "");
export const isPageLoading = (state: IPageState, id: string): boolean => state.loading.includes(id);
