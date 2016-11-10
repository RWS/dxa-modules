import { Router, Route } from "react-router";
import { PublicationContent } from "../../../../src/components/container/PublicationContent";
import { PageService } from "../../../mocks/services/PageService";
import { PublicationService } from "../../../mocks/services/PublicationService";
import { TaxonomyService } from "../../../mocks/services/TaxonomyService";
import { routing } from "../../../mocks/Routing";
import { localization } from "../../../mocks/services/LocalizationService";
import { Toc } from "../../../../src/components/presentation/Toc";
import { Page } from "../../../../src/components/presentation/Page";

import { TestHelper } from "../../../helpers/TestHelper";

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

const routingHistory = routing.getHistory();

const wrapper = TestHelper.wrapWithContext(
    {
        services: services
    },
    {
        services: React.PropTypes.object
    },
    (<Router history={routingHistory}>
        <Route path="/**(/**)" component={() => (<PublicationContent params={{ publicationId: "ish:123-1-1" }} />)} />
    </Router>));

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
                        Id: "123",
                        Title: "First element",
                        IsAbstract: false,
                        HasChildNodes: false,
                        Items: []
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
                services.pageService.setMockDataPage(null, { content: pageContent, title: "Title!" });
                const publicationContent = this._renderComponent(target);
                publicationContent.setState({
                    selectedTocItem: {
                        Id: "123",
                        IsAbstract: false,
                        HasChildNodes: false,
                        Title: "Some page",
                        Url: "page",
                        Items: []
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
                    expect(pageContentNode.children.length).toBe(1);
                    expect(pageContentNode.children[0].children.length).toBe(1);
                    expect(pageContentNode.children[0].children[0].innerHTML).toBe(pageContent);
                    done();
                }, 0);
            });

            it("updates page content when item is selected from toc", (done: () => void): void => {
                services.taxonomyService.setMockDataToc(null, [
                    {
                        Id: "1",
                        Title: "First element",
                        IsAbstract: true,
                        HasChildNodes: false,
                        Items: []
                    },
                    {
                        Id: "2",
                        Title: "Second element",
                        IsAbstract: true,
                        HasChildNodes: false,
                        Items: []
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
                        Id: "12345",
                        IsAbstract: true,
                        HasChildNodes: true,
                        Title: title,
                        Items: []
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
                    Id: "123456",
                    IsAbstract: false,
                    HasChildNodes: true,
                    Title: "Some page",
                    Url: "page-url",
                    Items: []
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
                services.pageService.setMockDataPage(null, { content: "<div/>", title: "Title!" });
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
                const first: ISitemapItem = {
                    Id: "ish:123-1-1024",
                    HasChildNodes: false,
                    IsAbstract: false,
                    Items: [],
                    Title: "First page!",
                    Url: "ish:123-1-16"
                };
                const second: ISitemapItem = {
                    Id: "ish:123-2-1024",
                    HasChildNodes: false,
                    IsAbstract: false,
                    Items: [],
                    Title: "Second page!",
                    Url: "ish:123-2-16"
                };
                routing.setPublicationLocation("ish:123-1-1", "Publication", first.Url, first.Title);

                services.taxonomyService.setMockDataToc(null, [first, second]);
                const publicationContent = this._renderComponent(target);

                const assert = (item: ISitemapItem, ready: () => void): void => {
                    // Use a timeout to allow the DataStore to return a promise with the data
                    setTimeout((): void => {
                        // tslint:disable-next-line:no-any
                        const treeView = TestUtils.findRenderedComponentWithType(publicationContent, TreeView as any);
                        const tocItems = ReactDOM.findDOMNode(treeView).querySelector("ul");
                        expect(tocItems.childNodes.length).toBe(2);
                        expect(tocItems.querySelector(".active").textContent).toBe(item.Title);
                        ready();
                    }, 0);
                };

                assert(first, (): void => {
                    if (second.Url) {
                        routing.setPageLocation(second.Url);
                    }
                    this._renderComponent(target);
                    assert(second, done);
                });

            });
        });

    }

    private _renderComponent(target: HTMLElement): PublicationContent {
        return ReactDOM.render(wrapper, target) as PublicationContent;
    }

}

new PublicationContentComponent().runTests();
