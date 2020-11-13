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

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { SearchResults } from "@sdl/dd/SearchResults/SearchResults";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { SearchService } from "test/mocks/services/SearchService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

import { ISearchQueryResults, ISearchQueryResult } from "interfaces/Search";

import { RENDER_DELAY, ASYNC_TEST_DELAY } from "test/Constants";

const services = {
    searchService: new SearchService()
};

const TEST_LOCALE = "en";
const TEST_QUERY = "TEST QUERY";
const TEST_CONTENT = `General Packet Radio Service (GPRS)General Packet Radio Service (GPRS) GPRS technology allows mobile phones to be used for
sending and receiving data over the mobile network (network service). GPRS technology allows mobile phones to be used for sending and receiving
data over the mobile network (network service). GPRS as such is a data bearer that enables wireless access to data networks like the Internet.
The applications that may use GPRS are WAP services, MMS and SMS messaging, and Java application downloading.Before you can use GPRS technology
Contact your network operator or service provider for availability, pricing and subscription to the GPRS service. Save the GPRS settings for each
of the applications used over GPRS. Parent topic: Your phone`;

class SearchResultsComponent extends TestBase {
    public runTests(): void {
        describe(`SearchResults component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.searchService.fakeDelay(false);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("show loading indicator on initial render", (): void => {
                const searchResults = this._renderComponent(target);
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                    searchResults,
                    // tslint:disable-next-line:no-any
                    ActivityIndicator as any
                );
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows an error message when search results fails to load", (done: () => void): void => {
                const errorMessage = "Search list failed to load!";
                services.searchService.fakeDelay(true);
                services.searchService.setMockDataSearch(errorMessage);
                const searchResults = this._renderComponent(target);

                setTimeout((): void => {
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                        searchResults,
                        // tslint:disable-next-line:no-any
                        ActivityIndicator as any
                    );
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(searchResults) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(
                        ".sdl-dita-delivery-button-group button"
                    );
                    expect(buttons.length).toEqual(1);

                    done();
                }, ASYNC_TEST_DELAY);
            });

            it("shows no-results message when search results returns no result", (done: () => void): void => {
                services.searchService.setMockDataSearch(null, {
                    hits: 0,
                    startIndex: 0,
                    queryResults: []
                });
                const searchResults = this._renderComponent(target);

                setTimeout((): void => {
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                        searchResults,
                        // tslint:disable-next-line:no-any
                        ActivityIndicator as any
                    );
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(searchResults) as HTMLElement;
                    const errorElement = domNode.querySelector(".search-results-list-empty") as HTMLElement;
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    expect(errorElement.textContent).toContain("mock-search.no.results");
                    done();
                }, RENDER_DELAY);
            });

            it("shows load more when more than 10 results found", (done: () => void): void => {
                const getSearchResultItem = (publicationId: string, pageId: string): ISearchQueryResult => ({
                    id: `ish:${publicationId}-${pageId}-1`,
                    content: TEST_CONTENT,
                    language: "en",
                    lastModifiedDate: new Date(),
                    publicationId,
                    publicationTitle: `Publication Title-${pageId}`,
                    pageId,
                    pageTitle: `Page Title-${pageId}`,
                    binaryContentType: "binary"
                });

                const publicationWithProductFamily = {
                    ...getSearchResultItem("47", "1000"),
                    productFamilyTitle: "Product Family",
                    productReleaseVersionTitle: "Product Release"
                };

                const publicationWithoutPublicationId = {
                    ...getSearchResultItem("", "1011"),
                    productFamilyTitle: "Product Family",
                    productReleaseVersionTitle: "Product Release"
                };

                services.searchService.setMockDataSearch(null, {
                    hits: 100,
                    startIndex: 0,
                    queryResults: [
                        ...Array(10)
                            .fill(42)
                            .map((publicationId: number, pageId: number) =>
                                getSearchResultItem(publicationId.toString(), pageId.toString())
                            ),
                        publicationWithProductFamily,
                        publicationWithoutPublicationId
                    ]
                } as ISearchQueryResults);

                const searchResults = this._renderComponent(target /*, "3310", "pub-10"*/);

                setTimeout((): void => {
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                        searchResults,
                        // tslint:disable-next-line:no-any
                        ActivityIndicator as any
                    );
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const items = TestUtils.scryRenderedDOMComponentsWithTag(searchResults, "h3");
                    expect(items.length).toBe(12);
                    items.forEach((x: HTMLElement, i: number) => {
                        if (i < items.length - 2) {
                            expect(x.textContent).toBe(`Page Title-${i}`);
                        } else if (i == items.length - 2) {
                            expect(x.textContent).toBe(publicationWithProductFamily.pageTitle);
                            const links = (x.parentElement as HTMLElement).querySelectorAll("nav a") as NodeListOf<
                                HTMLAnchorElement
                            >;
                            expect(links.length).toBe(3);
                            expect(links[0].title).toBe(publicationWithProductFamily.productFamilyTitle);
                            expect(links[1].title).toBe(publicationWithProductFamily.productReleaseVersionTitle);
                            expect(links[2].title).toBe(publicationWithProductFamily.publicationTitle);
                        }
                    });

                    // tslint:disable-next-line:no-any
                    const button = TestUtils.findRenderedComponentWithType(searchResults, Button as any);
                    expect(button).toBeDefined();

                    done();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement, searchQuery?: string, publicationId?: string): SearchResults {
        const comp = ReactDOM.render(
            <ComponentWithContext {...services}>
                <SearchResults
                    locale={TEST_LOCALE}
                    params={{ publicationId: publicationId || "", searchQuery: searchQuery || TEST_QUERY }}
                />
            </ComponentWithContext>,
            target
        ) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, SearchResults) as SearchResults;
    }
}

new SearchResultsComponent().runTests();
