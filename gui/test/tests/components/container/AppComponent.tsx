import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { App } from "@sdl/dd/container/App/App";
import { PublicationContentPresentation } from "@sdl/dd/PublicationContent/PublicationContentPresentation";
import { Url } from "utils/Url";
import { TestBase } from "@sdl/models";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { SearchService } from "test/mocks/services/SearchService";
import { localization } from "test/mocks/services/LocalizationService";
import { browserHistory } from "react-router";
import { isPage } from "utils/Page";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { Store } from "redux";
import { IState } from "store/interfaces/State";
import { pageLoaded, publicationsLoaded } from "store/actions/Api";
import { MD5 } from "object-hash";

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService,
    localizationService: localization,
    taxonomyService: new TaxonomyService(),
    searchService: new SearchService()
};
const PUB_ID_WITH_PAGE = "111-222-333-444";
const PUB_ID_NO_PAGE = "555-666-777-888";

class AppComponent extends TestBase {
    public runTests(): void {
        describe(`App component tests.`, (): void => {
            const target = super.createTargetElement();
            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            beforeAll(() => {
                browserHistory.push("");
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders publication content component on root", (): void => {
                const onRender = function (this: PublicationContentPresentation): JSX.Element {
                    const { publicationId, pageId, publication, page } = this.props;

                    expect(publicationId).toBe("1420746");
                    expect(pageId).toBe("publication-mp330");
                    expect(publication.title).toEqual("");
                    expect(page.title).toEqual("");

                    return (<div />);
                };

                spyOn(PublicationContentPresentation.prototype, "render").and.callFake(onRender);
                this._renderComponent(target);
            });

            it("renders publication content component when publication id and page id are set", (): void => {
                const onRender = function (this: PublicationContentPresentation): JSX.Element {
                    const { publicationId, pageId, publication, page } = this.props;
                    if (publicationId === PUB_ID_WITH_PAGE) {
                        expect(pageId).toBe("0000001");
                        expect(publication.title).toBe("pub-title");
                        expect(page.title).toBe("page-title");
                    } else {
                        expect(publicationId).toBe(PUB_ID_NO_PAGE);
                        expect(publication.title).toBe("pub-title");
                        expect(isPage(page)).toBeFalsy();
                        expect(page.title).toBe("");
                    }

                    return (<div />);
                };

                const app = this._renderComponent(target);

                spyOn(PublicationContentPresentation.prototype, "render").and.callFake(onRender);

                // Publication content
                browserHistory.push(Url.getPublicationUrl(PUB_ID_NO_PAGE, "pub-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();

                browserHistory.push(Url.getPageUrl(PUB_ID_WITH_PAGE, "0000001", "pub-title", "page-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        const store: Store<IState> = configureStore();

        store.dispatch(publicationsLoaded([{
            id: PUB_ID_WITH_PAGE,
            title: "pub-title",
            version: "1",
            logicalId: "1-1",
            createdOn: new Date()
        }, {
            id: PUB_ID_NO_PAGE,
            title: "pub-title",
            version: "1",
            logicalId: "1-2",
            createdOn: new Date()
        }]));
        store.dispatch(pageLoaded({
            id: "0000001",
            title: "page-title",
            content: "Page content"
        }, `${PUB_ID_WITH_PAGE}/0000001/${MD5({})}`));

        return ReactDOM.render(
            <Provider store={store}>
                <App services={services} />
            </Provider>
            , target) as App;
    }
}

new AppComponent().runTests();
