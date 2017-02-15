import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { PublicationContent } from "components/container/PublicationContent";
import { Toc } from "components/presentation/Toc";
import { Page } from "components/presentation/Page";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IPage } from "interfaces/Page";
import { ActivityIndicator, TreeView, ValidationMessage } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    taxonomyService: new TaxonomyService()
};
const PUBLICATION_ID = "ish:123-1-1";

class PublicationContentComponent extends TestBase {

    public runTests(): void {

        describe(`PublicationContent component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.taxonomyService.fakeDelay(false);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("show loading indicator on initial render", (): void => {
                services.taxonomyService.fakeDelay(true);
                const publicationContent = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                // One indicator for the toc, one for the page
                expect(activityIndicators.length).toBe(2, "Could not find activity indicators.");
            });

            it("shows toc", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, [
                    {
                        id: "123",
                        title: "First element",
                        hasChildNodes: false
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
                    // Page is still loading
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    // tslint:disable-next-line:no-any
                    const activityIndicatorsPage = TestUtils.scryRenderedComponentsWithType(page, ActivityIndicator as any);
                    expect(activityIndicatorsPage.length).toBe(1, "Could not find activity indicator.");
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
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    expect(page).not.toBeNull("Could not find page content.");
                    const pageContentNode = ReactDOM.findDOMNode(page);
                    // First node is toc, second breadcrumbs, third one is content navigation, fourth is page
                    expect(pageContentNode.children.length).toBe(4);
                    expect(pageContentNode.children[3].children.length).toBe(1);
                    expect(pageContentNode.children[3].children[0].innerHTML).toBe(pageContent);
                    done();
                }, 0);
            });

            it("updates page content when item is selected from toc", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, [
                    {
                        id: "1",
                        title: "First element",
                        hasChildNodes: false
                    },
                    {
                        id: "2",
                        title: "Second element",
                        hasChildNodes: false,
                        url: `/${encodeURIComponent(PUBLICATION_ID)}/12345/mp330/second-el-url`
                    }
                ]);
                const publicationContent = this._renderComponent(target);

                // Spy on the router
                spyOn(publicationContent.context.router, "push").and.callFake((path: string): void => {
                    // Check if routing was called with correct params
                    expect(path).toBe(`/${encodeURIComponent(PUBLICATION_ID)}/12345/mp330/second-el-url`);

                    // A page load was triggered by changing the selected item in the Toc
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    const pageNode = ReactDOM.findDOMNode(page) as HTMLElement;
                    expect(pageNode).not.toBeNull("Could not find page.");

                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(page, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(1, "One activity indicator should be rendered.");
                    done();
                });

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // Toc is ready
                    const toc = TestUtils.findRenderedComponentWithType(publicationContent, Toc);
                    // tslint:disable-next-line:no-any
                    const activityIndicatorsToc = TestUtils.scryRenderedComponentsWithType(toc, ActivityIndicator as any);
                    expect(activityIndicatorsToc.length).toBe(0, "Activity indicator should not be rendered.");
                    // Page is still loading
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    // tslint:disable-next-line:no-any
                    const activityIndicatorsPage = TestUtils.scryRenderedComponentsWithType(page, ActivityIndicator as any);
                    expect(activityIndicatorsPage.length).toBe(1, "Could not find activity indicator.");
                    // Click second element inside toc
                    // tslint:disable-next-line:no-any
                    const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                    const treeNode = ReactDOM.findDOMNode(treeView) as HTMLElement;
                    (treeNode.querySelectorAll(".content")[1] as HTMLDivElement).click();
                }, 0);
            });

            it("updates page content with title when a site map item without url is selected", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, []);
                const title = "Some page";
                const publicationContent = this._renderComponent(target);
                publicationContent.setState({
                    selectedTocItem: {
                        id: "12345",
                        title: title,
                        hasChildNodes: true
                    }
                });

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    const pageNode = ReactDOM.findDOMNode(page) as HTMLElement;
                    const pageTitleNode = pageNode.querySelector("h1") as HTMLElement;
                    expect(pageTitleNode).not.toBeNull("Could not find page title.");
                    expect(pageTitleNode.textContent).toBe(title);
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
                    const page = TestUtils.findRenderedComponentWithType(publicationContent, Page);
                    // tslint:disable-next-line:no-any
                    const validationMessage = TestUtils.findRenderedComponentWithType(page, ValidationMessage as any);
                    expect(validationMessage).not.toBeNull("Could not find validation message.");
                    const validationMessageNode = ReactDOM.findDOMNode(validationMessage);
                    expect(validationMessageNode && validationMessageNode.textContent).toBe("Page failed to load!");
                    done();
                }, 500);
            });

            it("updates the toc when the location changes", (done: () => void): void => {
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
                let publicationContent = this._renderComponent(target, first.url);

                const assert = (item: ITaxonomy, ready: () => void): void => {
                    // Use a timeout to allow the DataStore to return a promise with the data
                    setTimeout((): void => {
                        // tslint:disable-next-line:no-any
                        const treeView = TestUtils.findRenderedComponentWithType(publicationContent, TreeView as any);
                        const tocItems = ReactDOM.findDOMNode(treeView).querySelector("ul");
                        expect(tocItems.childNodes.length).toBe(2);
                        expect(tocItems.querySelector(".active").textContent).toBe(item.title);
                        ready();
                    }, 0);
                };

                assert(first, (): void => {
                    services.pageService.setMockDataPage(null, secondPage);
                    publicationContent = this._renderComponent(target, second.url);
                    assert(second, done);
                });

            });

        });

    }

    private _renderComponent(target: HTMLElement, pageId?: string): PublicationContent {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <PublicationContent params={{ publicationId: PUBLICATION_ID, pageIdOrPublicationTitle: pageId || "pub-title" }} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PublicationContent) as PublicationContent;
    }

}

new PublicationContentComponent().runTests();
