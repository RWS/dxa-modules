import { Router, Route } from "react-router";

import { App } from "../../../../src/components/container/App";
import { PublicationContent } from "../../../../src/components/container/PublicationContent";
import { PageService } from "../../../mocks/services/PageService";
import { PublicationService } from "../../../mocks/services/PublicationService";
import { TaxonomyService } from "../../../mocks/services/TaxonomyService";
import { localization } from "../../../mocks/services/LocalizationService";
import { routing } from "../../../mocks/Routing";
import { TestHelper } from "../../../helpers/TestHelper";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService,
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

const routingHistory = routing.getHistory();

const wrapper = TestHelper.wrapWithContext(
    {
        services: services,
    },
    {
        services: React.PropTypes.object,
    },
    (<Router history={routingHistory}>
        <Route path="/" component={() => (<App children={<PublicationContent params={{ publicationId: "ish:123-1-1" }} />} />)} />
    </Router>));


class AppComponent extends TestBase {

    public runTests(): void {

        describe(`App component tests.`, (): void => {
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
                this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        return ReactDOM.render(wrapper, target) as App;
    }
}

new AppComponent().runTests();
