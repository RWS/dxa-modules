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

import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Promise } from "es6-promise";
import { IPostComment } from "interfaces/Comments";
import { IComment } from "interfaces/ServerModels";

import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

export class PageService implements IPageService {
    private _mockDataPage: {
        error: string | null;
        info: IPage | undefined;
    } = {
        error: null,
        info: {
            id: "12345",
            content: "<span>Page content!</span>",
            title: "Page title!",
            sitemapIds: null
        }
    };

    private _mockDataComments: {
        comments: IComment[];
        error: string | null;
    } = {
        comments: [],
        error: null
    };

    public getPageInfo(publicationId: string, pageId: string): Promise<IPage> {
        const { error, info } = this._mockDataPage;
        if (fakeDelay) {
            return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error || !info) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(info);
            }
        }
    }

    public getPageInfoByLogicalId(publicationId: string, logicalId: string): Promise<IPage> {
        const { error, info } = this._mockDataPage;
        if (fakeDelay) {
            return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error || !info) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(info);
            }
        }
    }

    public getComments(
        publicationId: string,
        pageId: string,
        descending: boolean,
        top: number,
        skip: number,
        status: number[]
    ): Promise<IComment[]> {
        const { error, comments } = this._mockDataComments;
        if (fakeDelay) {
            return new Promise((resolve: (values?: IComment[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(comments);
            }
        }
    }

    public saveComment(data: IPostComment): Promise<IComment> {
        const { error, comments } = this._mockDataComments;
        if (fakeDelay) {
            return new Promise((resolve: (value?: IComment) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments[0]);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(comments[0]);
            }
        }
    }

    public setMockDataPage(error: string | null, info?: IPage): void {
        this._mockDataPage = {
            error,
            info
        };
    }

    public setMockDataComments(error: string | null, comments?: IComment[]): void {
        this._mockDataComments = {
            error,
            comments: comments || []
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
