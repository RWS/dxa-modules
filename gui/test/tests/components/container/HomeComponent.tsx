import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { Home } from "components/container/Home";
import { PublicationContent } from "components/container/PublicationContent";
import { ActivityIndicator} from "sdl-controls-react-wrappers";

import { PageService } from "test/mocks/services/PageService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { hashHistory } from "react-router";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

const services = {
    pageService: new PageService()
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
