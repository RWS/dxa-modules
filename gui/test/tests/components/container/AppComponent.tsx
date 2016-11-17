import { App } from "../../../../src/components/container/App";
import { PublicationContent } from "../../../../src/components/container/PublicationContent";
import { PageService } from "../../../mocks/services/PageService";
import { PublicationService } from "../../../mocks/services/PublicationService";
import { TaxonomyService } from "../../../mocks/services/TaxonomyService";
import { localization } from "../../../mocks/services/LocalizationService";
import { hashHistory } from "react-router";
import { Url } from "../../../../src/utils/Url";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
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
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("renders publication content component on root", (): void => {
                const onRender = function (this: PublicationContent): JSX.Element {
                    const { publicationId, pageIdOrPublicationTitle, publicationTitle, pageTitle } = this.props.params;

                    expect(publicationId).toBe("ish:1656863-1-1");
                    expect(pageIdOrPublicationTitle).toBeUndefined();
                    expect(publicationTitle).toBeUndefined();
                    expect(pageTitle).toBeUndefined();

                    return (<div />);
                };

                spyOn(PublicationContent.prototype, "render").and.callFake(onRender);
                this._renderComponent(target);
            });

            it("renders publication content component when publication id and page id are set", (): void => {
                const onRender = function (this: PublicationContent): JSX.Element {
                    const { publicationId, pageIdOrPublicationTitle, publicationTitle, pageTitle } = this.props.params;

                    if (publicationId === "pub-id-with-page") {
                        expect(pageIdOrPublicationTitle).toBe("page-id");
                        expect(publicationTitle).toBe("pub-title");
                        expect(pageTitle).toBe("page-title");
                    } else {
                        expect(publicationId).toBe("pub-id");
                        expect(pageIdOrPublicationTitle).toBe("pub-title");
                        expect(publicationTitle).toBeUndefined();
                        expect(pageTitle).toBeUndefined();
                    }

                    return (<div />);
                };

                const app = this._renderComponent(target);

                spyOn(PublicationContent.prototype, "render").and.callFake(onRender);

                // Publication content
                hashHistory.push(Url.getPublicationUrl("pub-id", "pub-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContent)).not.toBeNull();

                hashHistory.push(Url.getPageUrl("pub-id-with-page", "page-id", "pub-title", "page-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContent)).not.toBeNull();
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        return ReactDOM.render(
            (
                <App history={hashHistory} services={services} />
            )
            , target) as App;
    }
}

new AppComponent().runTests();
