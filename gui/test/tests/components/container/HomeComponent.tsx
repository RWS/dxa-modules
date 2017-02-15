import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { Home } from "components/container/Home";
import { PublicationContent } from "components/container/PublicationContent";
import { ActivityIndicator } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { hashHistory } from "react-router";

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
                target.parentElement.removeChild(target);
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
                    expect(homeNode.querySelector(".sdl-dita-delivery-searchbar input").getAttribute("placeholder")).toContain(errorMessage);
                    done();
                }, 0);
            });

            it("can interract with search search panel", (done: () => void): void => {
                const app = this._renderComponent(target);
                const homeNode = ReactDOM.findDOMNode(app);

                const searchBarNode = homeNode.querySelector(".sdl-dita-delivery-searchbar");
                expect(searchBarNode).not.toBeNull();

                const toggleSearchButtonNode = homeNode.querySelector(".sdl-dita-delivery-topbar-expand-search");
                expect(toggleSearchButtonNode).not.toBeNull();

                expect(getComputedStyle(homeNode.querySelector(".sdl-dita-delivery-searchbar")).top).toBe("-150px");
                TestUtils.Simulate.click(toggleSearchButtonNode);

                // Use a timeout to allow animation to be finished
                setTimeout((): void => {
                    expect(getComputedStyle(homeNode.querySelector(".sdl-dita-delivery-searchbar")).top).toBe("0px");
                    const inputElement = searchBarNode.querySelector("input");
                    const overlayNode = homeNode.querySelector(".sdl-dita-delivery-nav-mask");
                    expect(getComputedStyle(overlayNode).display).toBe("none");
                    TestUtils.Simulate.focus(inputElement);

                    expect(getComputedStyle(overlayNode).display).toBe("block");
                    TestUtils.Simulate.blur(inputElement);

                    expect(getComputedStyle(overlayNode).display).toBe("none");
                    TestUtils.Simulate.click(toggleSearchButtonNode);
                    // Use a timeout to allow animation to be finished
                    setTimeout((): void => {
                        expect(getComputedStyle(homeNode.querySelector(".sdl-dita-delivery-searchbar")).top).toBe("-150px");
                        done();
                    }, 310);
                }, 310);
            });
        });
    }

    private _renderComponent(target: HTMLElement, pubId?: string): Home {
        return ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <Router history={hashHistory}>
                        <Route path="*" component={() => (<Home><PublicationContent params={{ publicationId: pubId || "" }} /></Home>)} />
                    </Router>
                </ComponentWithContext>
            ), target) as Home;
    }
}

new HomeComponent().runTests();
