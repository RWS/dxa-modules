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

import { ISearchService } from "services/interfaces/SearchService";
import { ISearchQuery, ISearchQueryResults } from "interfaces/Search";
import { Promise } from "es6-promise";
import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

export class SearchService implements ISearchService {

    private _mockDataSearch: {
        error: string | null;
        result: ISearchQueryResults | undefined
    } = {
        error: null,
        result: undefined
    };

    public getSearchResults(query: ISearchQuery): Promise<ISearchQueryResults> {
        const { error, result } = this._mockDataSearch;
        if (fakeDelay) {
            return new Promise((resolve: (result?: ISearchQueryResults) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(result);
            }
        }
    }

    public setMockDataSearch(error: string | null, result?: ISearchQueryResults): void {
        this._mockDataSearch = {
            error: error,
            result
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
