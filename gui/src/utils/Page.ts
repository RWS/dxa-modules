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

import { IPage } from "interfaces/Page";

const DUMMY_PAGE = "_DUMMY_PAGE_TITLEP_";

const NO_PAGE = Object.freeze({
    id: "",
    title: "",
    content: "",
    sitemapIds: undefined
});
export const isDummyPage = (page: IPage): boolean => page.title === DUMMY_PAGE;

export const noPage = (id?: string): IPage => NO_PAGE;

export const isPage = (page: IPage): boolean => page !== NO_PAGE;

export const dummyPage = (id: string): IPage => {
    return id ? {
        id,
        title: DUMMY_PAGE,
        content: "",
        sitemapIds: undefined
    } : noPage(id);
};
