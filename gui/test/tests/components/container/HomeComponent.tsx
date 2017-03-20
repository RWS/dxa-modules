import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { HomePresentation } from "components/Home/HomePresentation";
import { PublicationContentPresentation } from "components/PublicationContent/PublicationContentPresentation";
import { ActivityIndicator } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { hashHistory } from "react-router";
import { dummyPage } from "utils/Page";

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

            it("show loading indicator on initial render", (): void => {
                services.publicationService.fakeDelay(true);
                const app = this._renderComponent(target, "ish:123-1-1");
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(app, ActivityIndicator as any);
                // One indicator for the toc, one for the page
                expect(activityIndicators.length).toBe(2, "Could not find activity indicators.");
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
                }, 0);
            });

            it("can interact with search panel", (): void => {
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
                const overlayNode = appNode.querySelector(".sdl-dita-delivery-nav-mask") as HTMLElement;
                expect(getComputedStyle(overlayNode).display).toBe("none");
                TestUtils.Simulate.focus(inputElement);

                expect(getComputedStyle(overlayNode).display).toBe("block");
                TestUtils.Simulate.blur(inputElement);

                expect(getComputedStyle(overlayNode).display).toBe("none");
                TestUtils.Simulate.click(toggleSearchButtonNode as HTMLElement);

                expect(homeNode.classList).not.toContain("search-open");
                expect(homeNode.classList).not.toContain("search-is-opening");
            });
        });
    }

    private _renderComponent(target: HTMLElement, pubId?: string): ComponentWithContext {
        const publicationId = pubId || "";
        const pageId = "";
        const publication = {id: publicationId, title: ""};
        return ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <Router history={hashHistory}>
                        <Route path="*" component={() => (<HomePresentation publicationId={publicationId}>
                            <PublicationContentPresentation
                                publicationId={publicationId}
                                publication={publication}
                                pageId = {pageId}
                                page={dummyPage(pageId)}
                                params={{publicationId}}
                                isPageLoading={false}
                                errorMessage="" />
                        </HomePresentation>)} />
                    </Router>
                </ComponentWithContext>
            ), target) as ComponentWithContext;
    }
}

new HomeComponent().runTests();
