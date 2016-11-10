import { App } from "../../../../src/components/container/App";
import { PageService } from "../../../mocks/services/PageService";
import { PublicationService } from "../../../mocks/services/PublicationService";
import { TaxonomyService } from "../../../mocks/services/TaxonomyService";
import { routing } from "../../../mocks/Routing";
import { localization } from "../../../mocks/services/LocalizationService";

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
                const app = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(app, ActivityIndicator as any);
                // One indicator for the toc, one for the page
                expect(activityIndicators.length).toBe(2, "Could not find activity indicators.");
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        return ReactDOM.render(<App services={services} routing={routing} />, target) as App;
    }
}

new AppComponent().runTests();
