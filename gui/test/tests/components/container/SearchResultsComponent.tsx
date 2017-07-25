import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { SearchResults } from "@sdl/dd/SearchResults/SearchResults";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { SearchService } from "test/mocks/services/SearchService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

import { ISearchQueryResults, ISearchQueryResult } from "interfaces/Search";

const services = {
    searchService: new SearchService()
};

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
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(searchResults, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows an error message when search results fails to load", (done: () => void): void => {
                const errorMessage = "Search list failed to load!";
                services.searchService.fakeDelay(true);
                services.searchService.setMockDataSearch(errorMessage);
                const searchResults = this._renderComponent(target);

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(searchResults, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(searchResults) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(".sdl-dita-delivery-button-group button");
                    expect(buttons.length).toEqual(1);

                    done();
                }, 100);
            });

            it("shows no-results message when search results returns no result", (done: () => void): void => {
                services.searchService.setMockDataSearch(null,
                    {
                        hits: 0,
                        startIndex: 0,
                        queryResults: []
                    });
                const searchResults = this._renderComponent(target);

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(searchResults, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(searchResults) as HTMLElement;
                    const errorElement = domNode.querySelector(".search-results-list-empty") as HTMLElement;
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    expect(errorElement.textContent).toContain("mock-search.no.results");
                    done();
                }, 0);
            });

            it("shows load more when more than 10 results found", (done: () => void): void => {

                services.searchService.setMockDataSearch(null,
                    {
                        hits: 100,
                        startIndex: 0,
                        queryResults: Array.apply(null, Array(10)).map((n: undefined, i: number) => {
                            const publicationId = "42";
                            const pageId = i.toString();
                            return {
                                id: `ish:${publicationId}-${pageId}-1`,
                                content: TEST_CONTENT,
                                language: "en",
                                lastModifiedDate: new Date(),
                                publicationId,
                                publicationTitle: `Publication Title-${i}`,
                                pageId,
                                pageTitle: `Page Title-${i}`
                            } as ISearchQueryResult;
                        })
                    } as ISearchQueryResults);

                const searchResults = this._renderComponent(target/*, "3310", "pub-10"*/);

                setTimeout((): void => {

                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(searchResults, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const items = TestUtils.scryRenderedDOMComponentsWithTag(searchResults, "h3");
                    expect(items.length).toBe(10);
                    items.forEach((x: HTMLElement, i: number) => {
                        expect(x.textContent).toBe(`Page Title-${i}`);
                    });

                    // tslint:disable-next-line:no-any
                    const button = TestUtils.findRenderedComponentWithType(searchResults, Button as any);
                    expect(button).toBeDefined();

                    done();
                }, 0);
            });

        });
    }

    private _renderComponent(target: HTMLElement, searchQuery?: string, publicationId?: string): SearchResults {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <SearchResults
                        params={{ publicationId: publicationId || "", searchQuery: searchQuery || TEST_QUERY }} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, SearchResults) as SearchResults;
    }
}

new SearchResultsComponent().runTests();
