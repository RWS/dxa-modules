import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { PublicationContentPresentation } from "components/PublicationContent/PublicationContentPresentation";
import { Toc } from "components/presentation/Toc";
import { PagePresentation } from "components/Page/PagePresentation";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { ActivityIndicator, TreeView, DropdownList } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { PublicationContent } from "src/components/PublicationContent/PublicationContent";

import { FetchPage } from "components/helpers/FetchPage";
import { updateCurrentPublication } from "src/store/actions/Actions";
import { Store } from "redux";
import { IState } from "src/store/interfaces/State";
import { FetchProductReleaseVersions } from "src/components/helpers/FetchProductReleaseVersions";
import { getCurrentPub } from "store/reducers/Reducer";
import { FetchPublications } from "src/components/helpers/FetchPublications";

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    taxonomyService: new TaxonomyService()
};
const PUBLICATION_ID = "ish:123-1-1";

class PublicationContentComponent extends TestBase {
    private store: Store<IState>;
    public runTests(): void {

        describe(`PublicationContent component tests.`, (): void => {
            const target = super.createTargetElement();

            beforeEach(() => {
                this.store = configureStore();
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.taxonomyService.fakeDelay(false);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("show loading indicator on initial render", (): void => {
                services.taxonomyService.fakeDelay(true);
                const publicationContent = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                // Don't show page loading indicator, because no page is loading
                expect(activityIndicators.length).toBe(1, "Toc loading indicator is rendered");
            });

            it("shows toc", (done: () => void): void => {
                // services.taxonomyService.fakeDelay(true);
                services.taxonomyService.setMockDataToc(null, [
                    {
                        id: "123",
                        title: "First element",
                        hasChildNodes: false,
                        url: "some/url"
                    }
                ]);

                const publicationContent = this._renderComponent(target);
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // Toc is ready
                    const toc = TestUtils.findRenderedComponentWithType(publicationContent, Toc);
                    // tslint:disable-next-line:no-any
                    const activityIndicatorsToc = TestUtils.scryRenderedComponentsWithType(toc, ActivityIndicator as any);
                    expect(activityIndicatorsToc.length).toBe(0, "Activity indicator should not be rendered.");

                    // Check if tree view nodes are there
                    // tslint:disable-next-line:no-any
                    const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                    const treeNode = ReactDOM.findDOMNode(treeView) as HTMLElement;
                    const nodes = treeNode.querySelectorAll(".content");
                    expect(nodes.length).toBe(1);
                    expect(nodes.item(0).textContent).toBe("First element");
                    done();
                }, 0);
            });

            it("renders content for a specific page", (done: () => void): void => {
                const pageContent = "<div>Page content!</div>";
                services.taxonomyService.setMockDataToc(null, []);
                services.pageService.setMockDataPage(null, {
                    id: "12345",
                    content: pageContent,
                    title: "Title!",
                    sitemapIds: null
                });

                const publicationContent = this._renderComponent(target, "12345");

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, PagePresentation);
                    expect(page).not.toBeNull("Could not find page content.");
                    const pageContentNode = ReactDOM.findDOMNode(page);
                    // 1 toc
                    // 2 breadcrumbs,
                    // 3 wrong lanauge warning
                    // 4 version dropdown
                    // 5 content navigation
                    // 6 page
                    // NOTE: Why is it improtant to test order? Are we testing our functionality or react?
                    expect(pageContentNode.children.length).toBe(6);
                    expect(pageContentNode.children[5].children.length).toBe(1);
                    expect(pageContentNode.children[5].children[0].innerHTML).toBe(pageContent);
                    done();
                }, 0);
            });

            it("updates page content when item is selected from toc", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, [
                    {
                        id: "1",
                        title: "First element",
                        hasChildNodes: false,
                        url: "some/url"
                    },
                    {
                        id: "2",
                        title: "Second element",
                        hasChildNodes: false,
                        url: `/${encodeURIComponent(PUBLICATION_ID)}/12345/mp330/second-el-url`
                    }
                ]);
                const publicationContent = this._renderComponent(target);

                const checkLoadedPage = () => {
                    // Check if routing was called with correct params
                    const store = this.store as Store<IState>;
                    const state = store.getState();
                    const {publicationId, pageId, anchor } = state.publication;
                    expect(publicationId).toBe(PUBLICATION_ID);
                    expect(pageId).toBe("12345");
                    expect(anchor).toBe("");

                    // A page load was triggered by changing the selected item in the Toc
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, PagePresentation);
                    const pageNode = ReactDOM.findDOMNode(page) as HTMLElement;
                    expect(pageNode).not.toBeNull("Could not find page.");
                    done();
                };

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // Toc is ready
                    const toc = TestUtils.findRenderedComponentWithType(publicationContent, Toc);
                    // tslint:disable-next-line:no-any
                    const activityIndicatorsToc = TestUtils.scryRenderedComponentsWithType(toc, ActivityIndicator as any);
                    expect(activityIndicatorsToc.length).toBe(0, "Activity indicator should not be rendered.");

                    // Click second element inside toc
                    // tslint:disable-next-line:no-any
                    const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                    const treeNode = ReactDOM.findDOMNode(treeView) as HTMLElement;
                    (treeNode.querySelectorAll(".content")[1] as HTMLDivElement).click();
                    setTimeout(checkLoadedPage, 110);
                }, 0);
            });

            it("updates page content with no page selected message when a site map item without url is selected", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, []);
                const publicationContent = this._renderComponent(target);
                publicationContent.setState({
                    selectedTocItem: {
                        id: "12345",
                        title: "Some page",
                        hasChildNodes: true
                    }
                });

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, PagePresentation);
                    const pageNode = ReactDOM.findDOMNode(page) as HTMLElement;
                    const pageContentNode = pageNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    expect(pageContentNode.textContent).toBe("mock-components.page.nothing.selected");
                    done();
                }, 0);
            });

            it("shows an error message when page info fails to load", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, [{
                    id: "123456",
                    title: "Some page",
                    url: "page-url",
                    hasChildNodes: true
                }]);
                services.pageService.setMockDataPage("Page failed to load!");
                const publicationContent = this._renderComponent(target, "123");

                // Wait for the tree view to select the first node
                // Treeview uses debouncing for node selection so a timeout is required
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, PagePresentation);

                    const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(".sdl-dita-delivery-button-group button");
                    expect(buttons.length).toEqual(2);
                    done();
                }, 0);
            });

            it("updates the toc when the current publiction state changes", (done: () => void): void => {
                const first: ITaxonomy = {
                    id: "1",
                    title: "First page!",
                    url: "1",
                    hasChildNodes: false
                };
                const firstPage: IPage = {
                    content: "Page 1",
                    id: "1",
                    title: "First page!",
                    sitemapIds: ["1"]
                };
                const second: ITaxonomy = {
                    id: "2",
                    title: "Second page!",
                    url: "2",
                    hasChildNodes: false
                };
                const secondPage: IPage = {
                    content: "Page 2",
                    id: "2",
                    title: "Second page!",
                    sitemapIds: ["2"]
                };

                services.taxonomyService.setMockDataToc(null, [first, second]);
                services.pageService.setMockDataPage(null, firstPage);
                let publicationContent = this._renderComponent(target, first.id);

                const assert = (item: ITaxonomy, ready: () => void): void => {
                    // Use a timeout to allow the DataStore to return a promise with the data
                    setTimeout((): void => {
                        // tslint:disable-next-line:no-any
                        const treeView = TestUtils.findRenderedComponentWithType(publicationContent, TreeView as any);
                        const tocItems = ReactDOM.findDOMNode(treeView).querySelector("ul") as HTMLUListElement;
                        expect(tocItems.childNodes.length).toBe(2);
                        expect((tocItems.querySelector(".active") as HTMLElement).textContent).toBe(item.title);
                        ready();
                    }, 0);
                };

                assert(first, (): void => {
                    services.pageService.setMockDataPage(null, secondPage);
                    publicationContent = this._renderComponent(target, second.id);
                    assert(second, done);
                });

            });

            it("can switch to another product release version of the same publication", (done: () => void): void => {
                const publications: IPublication[] = [{
                    id: "1",
                    title: "Publication1",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-1",
                    productFamily: "PF",
                    productReleaseVersion: "PR1",
                    language: "en"
                }, {
                    id: "2",
                    title: "Publication2",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-1",
                    productFamily: "PF",
                    productReleaseVersion: "PR2",
                    language: "en"
                }];
                services.publicationService.setMockDataPublications(null, publications, [{ title: "PF" }],
                    [{ title: "PR1", value: "pr1" }, { title: "PR2", value: "pr2" }]);
                const publicationContent = this._renderComponent(target, undefined, "1");

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const dropdownList = TestUtils.findRenderedComponentWithType(publicationContent, DropdownList as any);
                    const dropdownListNode = ReactDOM.findDOMNode(dropdownList);
                    const listItems = dropdownListNode.querySelectorAll("li");
                    expect(listItems.length).toBe(2);

                    const unsubscribe = this.store.subscribe(() => {
                        expect(getCurrentPub(this.store.getState()).publicationId).toBe("2");
                        unsubscribe();
                        done();
                    });
                    // Click on the second release version
                    listItems[1].click();
                }, 0);
            });

        });

    }

    private _renderComponent(target: HTMLElement, pageId?: string, publicationId?: string): PublicationContentPresentation {
        const store = this.store as Store<IState>;

        store.dispatch(updateCurrentPublication(publicationId || PUBLICATION_ID, pageId));

        const comp = ReactDOM.render(
            (
                <Provider store={store}>
                    <ComponentWithContext {...services}>
                        <FetchPage />
                        <FetchPublications />
                        <FetchProductReleaseVersions />
                        <PublicationContent />
                    </ComponentWithContext>
                </Provider>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PublicationContentPresentation) as PublicationContentPresentation;
    }

}

new PublicationContentComponent().runTests();
