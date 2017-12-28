import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { HomePresentation } from "@sdl/dd/Home/HomePresentation";
import { PublicationContentPresentation } from "@sdl/dd/PublicationContent/PublicationContentPresentation";
import { ActivityIndicator } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { browserHistory } from "react-router";
import { dummyPage } from "utils/Page";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";

import { RENDER_DELAY } from "test/Constants";

const services = {
    publicationService: new PublicationService()
};

class HomeComponent extends TestBase {
    public runTests(): void {
        describe(`Home component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.publicationService.fakeDelay(false);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("shows loading indicator on initial render", (): void => {
                services.publicationService.fakeDelay(true);
                const app = this._renderComponent(target, "ish:123-1-1", true);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(app, ActivityIndicator as any);
                // One indicator for the toc, one for the page
                expect(activityIndicators.length).toBe(2, "Could not find activity indicators.");
            });

            // TODO: Errors are not handled on home page yet
            xit("shows an error when list publications are failed to load", (done: () => void): void => {
                const publicationsLoadError = "Publications are not loaded";
                services.publicationService.fakeDelay(true);
                services.publicationService.setMockDataPublications(publicationsLoadError);
                const app = this._renderComponent(target);
                const homeNode = ReactDOM.findDOMNode(app);

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const input = homeNode.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
                    expect(input.getAttribute("placeholder")).toContain(publicationsLoadError);
                    done();
                }, RENDER_DELAY);
            });

            it("shows an error message in the search bar when the publication title failed to load", (done: () => void): void => {
                const errorMessage = "Publication title is invalid!";
                services.publicationService.setMockDataPublication(errorMessage);
                const app = this._renderComponent(target, "ish:123-1-1");
                const homeNode = ReactDOM.findDOMNode(app);

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const input = homeNode.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
                    expect(input.getAttribute("placeholder")).toContain(errorMessage);
                    done();
                }, RENDER_DELAY);
            });

            it("can interact with search panel", (done: () => void): void => {
                const searchQuery = "search on button click";
                const app = this._renderComponent(target);
                const appNode = ReactDOM.findDOMNode(app);
                const homeComp = TestUtils.findRenderedComponentWithType(app, HomePresentation);
                const homeNode = ReactDOM.findDOMNode(homeComp);

                const searchBarNode = appNode.querySelector(".sdl-dita-delivery-searchbar") as HTMLElement;
                const toggleSearchButtonNode = appNode.querySelector(".sdl-dita-delivery-topbar-expand-search");
                expect(toggleSearchButtonNode).not.toBeNull();

                expect(getComputedStyle(searchBarNode).top).toBe("-150px");
                TestUtils.Simulate.click(toggleSearchButtonNode as HTMLElement);

                expect(homeNode.classList).toContain("search-open");
                expect(homeNode.classList).not.toContain("search-is-opening");
                const inputElement = (searchBarNode as HTMLElement).querySelector("input") as HTMLInputElement;
                inputElement.value = searchQuery;

                const overlayNode = appNode.querySelector(".sdl-dita-delivery-nav-mask") as HTMLElement;

                TestUtils.Simulate.focus(inputElement);
                expect(getComputedStyle(overlayNode).display).toBe("block", "Overlay should be visible after focus");

                TestUtils.Simulate.blur(inputElement);
                expect(getComputedStyle(overlayNode).display).toBe("none", "Overlay should go away after blur");
                TestUtils.Simulate.click(toggleSearchButtonNode as HTMLElement);

                spyOn(browserHistory, "push").and.callFake((path: string): void => {
                    // Check if routing was called with correct params
                    expect(path).toBe(`/search/${encodeURIComponent(searchQuery)}`);
                    expect(homeNode.classList).not.toContain("search-open");
                    expect(homeNode.classList).not.toContain("search-is-opening");
                    done();
                });

                const searchButton = document.querySelector(
                    ".sdl-dita-delivery-searchbar .search-button"
                ) as HTMLElement;
                TestUtils.Simulate.click(searchButton);
            });
        });
    }

    private _renderComponent(target: HTMLElement, pubId?: string, loadingPage?: boolean): ComponentWithContext {
        const publicationId = pubId || "";
        const pageId = "";
        const publication = {
            id: publicationId,
            title: "",
            createdOn: new Date(),
            version: "1",
            logicalId: "GUID-123"
        };
        const isPageLoading = loadingPage || false;

        const store = configureStore();

        return ReactDOM.render(
            <ComponentWithContext {...services}>
                <Router history={browserHistory}>
                    <Route
                        path="*"
                        component={() => (
                            <Provider store={store}>
                                <HomePresentation params={{ publicationId }}>
                                    <PublicationContentPresentation
                                        publicationId={publicationId}
                                        publication={publication}
                                        pageId={pageId}
                                        anchor=""
                                        page={dummyPage(pageId)}
                                        isPageLoading={isPageLoading}
                                        productReleaseVersions={[]}
                                        productReleaseVersion={""}
                                        errorMessage=""
                                        isPublicationFound={true}
                                        splitterPosition={0}
                                        conditions={{}}
                                    />
                                </HomePresentation>
                            </Provider>
                        )}
                    />
                </Router>
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new HomeComponent().runTests();
