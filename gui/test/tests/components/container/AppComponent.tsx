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
import { localization } from "test/mocks/services/LocalizationService";
import { hashHistory } from "react-router";
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
    taxonomyService: new TaxonomyService()
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
                hashHistory.push("");
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
                    console.log(pageId, page);
                    if (publicationId === PUB_ID_WITH_PAGE) {
                        expect(pageId).toBe("0000001");
                        expect(publication.title).toBe("pub-title");
                        expect(page.title).toBe("page-title");
                    } else {
                        expect(publicationId).toBe(PUB_ID_NO_PAGE);
                        expect(publication.title).toBe("pub-title");
                        console.log("page", page);
                        expect(isPage(page)).toBeFalsy();
                        expect(page.title).toBe("");
                    }

                    return (<div />);
                };

                const app = this._renderComponent(target);

                spyOn(PublicationContentPresentation.prototype, "render").and.callFake(onRender);
                const url = Url.getPublicationUrl(PUB_ID_NO_PAGE, "pub-title");
                console.log("!", Url.parsePageUrl(url));
                const url2 = Url.getPublicationUrl(PUB_ID_NO_PAGE, "pub-title");
                console.log("2", Url.parsePageUrl(url2));

                // Publication content
                hashHistory.push(Url.getPublicationUrl(PUB_ID_NO_PAGE, "pub-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();

                hashHistory.push(Url.getPageUrl(PUB_ID_WITH_PAGE, "0000001", "pub-title", "page-title"));
                expect(TestUtils.findRenderedComponentWithType(app, PublicationContentPresentation)).not.toBeNull();
            });
        });
    }

    private _renderComponent(target: HTMLElement): App {
        const store: Store<IState> = configureStore();

        store.dispatch(publicationsLoaded([{
            id: PUB_ID_WITH_PAGE,
            title: "pub-title"
        }, {
            id: PUB_ID_NO_PAGE,
            title: "pub-title"
        }]));
        store.dispatch(pageLoaded({
            id: "0000001",
            title: "page-title",
            content: "Page content"
        }, `${PUB_ID_WITH_PAGE}/0000001/${MD5({})}`));

        return ReactDOM.render(
            <Provider store={store}>
                <App history={hashHistory} services={services} />
            </Provider>
            , target) as App;
    }
}

new AppComponent().runTests();
