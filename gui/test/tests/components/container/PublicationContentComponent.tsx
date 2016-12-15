import { PublicationContent } from "components/container/PublicationContent";
import { Toc } from "components/presentation/Toc";
import { Page } from "components/presentation/Page";
import { ITaxonomy } from "interfaces/Taxonomy";

import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { localization } from "test/mocks/services/LocalizationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import TreeView = SDL.ReactComponents.TreeView;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;
const TestUtils = React.addons.TestUtils;

const services = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

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

            it("updates page content when selected site map item changes", (done: () => void): void => {
                const pageContent = "<div>Page content!</div>";
                services.taxonomyService.setMockDataToc(null, []);
                services.pageService.setMockDataPage(null, {
                    id: "12345",
                    content: pageContent,
                    title: "Title!"
                });
                const publicationContent = this._renderComponent(target);
                publicationContent.setState({
                    selectedTocItem: {
                        id: "123",
                        title: "Some page",
                        url: "page",
                        hasChildNodes: false
                    }
                });
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
                    // Click second element inside toc
                    // tslint:disable-next-line:no-any
                    const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                    const treeNode = ReactDOM.findDOMNode(treeView) as HTMLElement;
                    (treeNode.querySelectorAll(".content")[1] as HTMLDivElement).click();

                    // Treeview uses debouncing for node selection so a timeout is required
                    setTimeout((): void => {
                        // All is loaded
                        // tslint:disable-next-line:no-any
                        const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationContent, ActivityIndicator as any);
                        expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");
                        const pageNode = ReactDOM.findDOMNode(page) as HTMLElement;
                        const pageTitleNode = pageNode.querySelector("h1") as HTMLElement;
                        expect(pageTitleNode).not.toBeNull("Could not find page title.");
                        expect(pageTitleNode.textContent).toBe("Second element");
                        done();
                    }, 200);
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
                const publicationContent = this._renderComponent(target);

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

            it("shows an error message when publication title failed to load", (done: () => void): void => {
                const errorMessage = "Page title is invalid!";
                services.publicationService.setMockDataPublication(errorMessage);
                services.pageService.setMockDataPage(null, {
                    id: "12345",
                    content: "<div/>",
                    title: "Title!"
                });
                const publicationContent = this._renderComponent(target);

                // Wait for the tree view to select the first node
                // Treeview uses debouncing for node selection so a timeout is required
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const validationMessage = TestUtils.findRenderedComponentWithType(publicationContent, ValidationMessage as any);
                    expect(validationMessage).not.toBeNull("Could not find validation message.");
                    const validationMessageNode = ReactDOM.findDOMNode(validationMessage);
                    expect(validationMessageNode && validationMessageNode.textContent).toBe(errorMessage);
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
                const second: ITaxonomy = {
                    id: "2",
                    title: "Second page!",
                    url: "2",
                    hasChildNodes: false
                };

                services.taxonomyService.setMockDataToc(null, [first, second]);
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
                    publicationContent = this._renderComponent(target, second.url);
                    assert(second, done);
                });

            });
        });

    }

    private _renderComponent(target: HTMLElement, pageId?: string): PublicationContent {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext services={services}>
                    <PublicationContent params={{ publicationId: "ish:123-1-1", pageIdOrPublicationTitle: pageId || "pub-title" }} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PublicationContent) as PublicationContent;
    }

}

new PublicationContentComponent().runTests();
