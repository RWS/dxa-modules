import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { App } from "components/container/App";
import { PublicationContentPresentation } from "components/PublicationContent/PublicationContentPresentation";
import { Url } from "utils/Url";
import { TestBase } from "sdl-models";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { localization } from "test/mocks/services/LocalizationService";
import { hashHistory } from "react-router";

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

            beforeAll(() => {
                hashHistory.push("");
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders publication content component on root", (): void => {
                const onRender = function (this: PublicationContentPresentation): JSX.Element {
                    const { publicationId, pageIdOrPublicationTitle, publicationTitle, pageTitle } = this.props.params;

                    expect(publicationId).toBe("1420746");
                    expect(pageIdOrPublicationTitle).toBe("publication-mp330");
                    expect(publicationTitle).toBeUndefined();
                    expect(pageTitle).toBeUndefined();

                    return (<div />);
                };

                spyOn(PublicationContentPresentation.prototype, "render").and.callFake(onRender);
                this._renderComponent(target);
            });

            it("renders publication content component when publication id and page id are set", (): void => {
                const onRender = function (this: PublicationContentPresentation): JSX.Element {
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

                spyOn(PublicationContentPresentation.prototype, "render").and.callFake(onRender);

                // Publication content
                hashHistory.push(Url.getPublicationUrl("pub-id", "pub-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();

                hashHistory.push(Url.getPageUrl("pub-id-with-page", "page-id", "pub-title", "page-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        return ReactDOM.render(
                <App history={hashHistory} services={services} />
            , target) as App;
    }
}

new AppComponent().runTests();
