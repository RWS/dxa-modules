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

import { SearchService } from "services/client/SearchService";
import { TestBase } from "@sdl/models";
import { IWindow } from "interfaces/Window";
import { ISearchQuery } from "interfaces/Search";
import { FakeXMLHttpRequest } from "test/mocks/XmlHttpRequest";

interface IXMLHttpRequestWindow extends Window {
    XMLHttpRequest: {};
}
class PageServiceTests extends TestBase {
    public runTests(): void {
        const win = window as IWindow;
        const mocksFlag = win.SdlDitaDeliveryMocksEnabled;
        const searchService = new SearchService();
        const startIndex = 0;
        const _testQuery = "SDL: WEB";
        const _testLocale = "en";

        const defaultQuery = {
            startIndex,
            locale: _testLocale,
            searchQuery: _testQuery
        } as ISearchQuery;

        describe("Search service tests.", (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can get search results", (done: () => void): void => {
                searchService
                    .getSearchResults(defaultQuery)
                    .then(searchResults => {
                        expect(searchResults).toBeDefined();
                        if (searchResults) {
                            expect(searchResults.hits).toBe(186);
                            expect(searchResults.queryResults.length).toBe(10);
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("is not cached in memory", (done: () => void): void => {
                const spy = spyOn(XMLHttpRequest.prototype, "open").and.callThrough();
                searchService
                    .getSearchResults(defaultQuery)
                    .then(searchResults => {
                        expect(searchResults).toBeDefined();
                        if (searchResults) {
                            expect(searchResults.hits).toBe(186);
                            expect(searchResults.queryResults.length).toBe(10);
                            expect(spy).toHaveBeenCalled();
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("returns a proper error when search can not happen", (done: () => void): void => {
                const failMessage = "failure-searchin-item";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(() => new FakeXMLHttpRequest(failMessage));
                searchService
                    .getSearchResults(defaultQuery)
                    .then(searchResults => {
                        fail("Search should not happen");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain(failMessage);
                        done();
                    });
            });
        });
    }
}

new PageServiceTests().runTests();
