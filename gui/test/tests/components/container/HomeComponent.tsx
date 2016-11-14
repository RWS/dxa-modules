import { Router, Route } from "react-router";
import { Home } from "../../../../src/components/container/Home";
import { PublicationContent } from "../../../../src/components/container/PublicationContent";
import { PageService } from "../../../mocks/services/PageService";
import { PublicationService } from "../../../mocks/services/PublicationService";
import { TaxonomyService } from "../../../mocks/services/TaxonomyService";
import { localization } from "../../../mocks/services/LocalizationService";
import { ComponentWithContext } from "../../../mocks/ComponentWithContext";
import { hashHistory } from "react-router";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
const TestUtils = React.addons.TestUtils;

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService,
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

class HomeComponent extends TestBase {

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
                <ComponentWithContext services={services}>
                    <Router history={hashHistory}>
                        <Route path="/" component={() => (<Home children={<PublicationContent params={{ publicationId: "ish:123-1-1" }} />} />)} />
                    </Router>
                </ComponentWithContext>
            )
            , target) as Home;
    }
}

new HomeComponent().runTests();
