import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { Home } from "components/container/Home";
import { PublicationContent } from "components/container/PublicationContent";
import { ActivityIndicator } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { hashHistory } from "react-router";

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService()
};

class HomeComponent extends TestBase {

    public runTests(): void {

        describe(`Home component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.pageService.fakeDelay(false);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("show loading indicator on initial render", (): void => {
                services.pageService.fakeDelay(true);
                const app = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(app, ActivityIndicator as any);
                // One indicator for the toc, one for the page
                expect(activityIndicators.length).toBe(2, "Could not find activity indicators.");
            });

            it("shows an error message in the search bar when the publication title failed to load", (done: () => void): void => {
                const errorMessage = "Page title is invalid!";
                services.publicationService.setMockDataPublication(errorMessage);
                const app = this._renderComponent(target);

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const homeNode = ReactDOM.findDOMNode(app);
                    expect(homeNode.querySelector(".sdl-dita-delivery-searchbar input").getAttribute("placeholder")).toContain(errorMessage);
                    done();
                }, 0);
            });
        });
    }

    private _renderComponent(target: HTMLElement): Home {
        return ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <Router history={hashHistory}>
                        <Route path="*" component={() => (<Home><PublicationContent params={{ publicationId: "ish:123-1-1" }} /></Home>)} />
                    </Router>
                </ComponentWithContext>
            )
            , target) as Home;
    }
}

new HomeComponent().runTests();
