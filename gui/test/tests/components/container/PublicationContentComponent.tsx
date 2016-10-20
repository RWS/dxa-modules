import { PublicationContent } from "../../../../src/components/container/PublicationContent";
import { ISitemapItem } from "../../../../src/interfaces/ServerModels";
import { DataStore } from "../../../mocks/DataStore";
import { routing } from "../../../mocks/Routing";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

const dataStoreMock = new DataStore();

class PublicationContentComponent extends TestBase {

    public runTests(): void {

        describe(`PublicationContent component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                dataStoreMock.fakeDelay(false);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("show loading indicator on initial render", (): void => {
                dataStoreMock.fakeDelay(true);
                this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
            });

            it("shows toc", (done: () => void): void => {
                dataStoreMock.setMockDataToc(null, [
                    {
                        Id: "123",
                        Title: "First element",
                        IsAbstract: false,
                        HasChildNodes: false,
                        Items: []
                    }
                ]);
                this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // Toc is ready
                    expect(domNode.querySelector(".sdl-dita-delivery-toc .sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    // Page is still loading
                    expect(domNode.querySelector(".sdl-dita-delivery-page .sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(1);
                    expect(nodes.item(0).textContent).toBe("First element");
                    done();
                }, 0);
            });

            it("updates page content when selected site map item changes", (done: () => void): void => {
                const pageContent = "<div>Page content!</div>";
                dataStoreMock.setMockDataToc(null, []);
                dataStoreMock.setMockDataPage(null, { content: pageContent, title: "Title!" });
                const component = this._renderComponent(target);
                component.setState({
                    selectedTocItem: {
                        Id: "123",
                        IsAbstract: false,
                        HasChildNodes: false,
                        Title: "Some page",
                        Url: "page",
                        Items: []
                    }
                });
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    expect(pageContentNode.children.length).toBe(1);
                    expect(pageContentNode.innerHTML).toBe(pageContent);
                    done();
                }, 0);
            });

            it("updates page content when item is selected from toc", (done: () => void): void => {
                dataStoreMock.setMockDataToc(null, [
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
                this._renderComponent(target);

                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // Toc is ready
                    expect(domNode.querySelector(".sdl-dita-delivery-toc .sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    // Page is still loading
                    expect(domNode.querySelector(".sdl-dita-delivery-page .sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                    // Click second element
                    (domNode.querySelectorAll(".sdl-treeview .content")[1] as HTMLDivElement).click();

                    // Treeview uses debouncing for node selection so a timeout is required
                    setTimeout((): void => {
                        // All is loaded
                        expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                        const pageTitleNode = domNode.querySelector(".page-content h1") as HTMLElement;
                        expect(pageTitleNode).not.toBeNull("Could not find page title.");
                        expect(pageTitleNode.textContent).toBe("Second element");
                        done();
                    }, 200);
                }, 0);
            });

            it("updates page content with title when a site map item without url is selected", (done: () => void): void => {
                dataStoreMock.setMockDataToc(null, []);
                const title = "Some page";
                const component = this._renderComponent(target);
                component.setState({
                    selectedTocItem: {
                        Id: "12345",
                        IsAbstract: true,
                        HasChildNodes: true,
                        Title: title,
                        Items: []
                    }
                });
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const pageTitleNode = domNode.querySelector(".page-content h1") as HTMLElement;
                    expect(pageTitleNode).not.toBeNull("Could not find page title.");
                    expect(pageTitleNode.textContent).toBe(title);
                    done();
                }, 0);
            });

            it("shows an error message when page info fails to load", (done: () => void): void => {
                dataStoreMock.setMockDataToc(null, [{
                    Id: "123456",
                    IsAbstract: false,
                    HasChildNodes: true,
                    Title: "Some page",
                    Url: "page-url",
                    Items: []
                }]);
                dataStoreMock.setMockDataPage("Page failed to load!");
                this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Wait for the tree view to select the first node
                // Treeview uses debouncing for node selection so a timeout is required
                setTimeout((): void => {
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const validationMessageNode = domNode.querySelector(".sdl-validationmessage");
                    expect(validationMessageNode).not.toBeNull("Could not find validation message.");
                    expect(validationMessageNode && validationMessageNode.textContent).toBe("Page failed to load!");
                    done();
                }, 500);
            });

            it("shows an error message when publication title failed to load", (done: () => void): void => {
                const errorMessage = "Page title is invalid!";
                dataStoreMock.setMockDataPublication(errorMessage);
                dataStoreMock.setMockDataPage(null, { content: "<div/>", title: "Title!" });
                this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Wait for the tree view to select the first node
                // Treeview uses debouncing for node selection so a timeout is required
                setTimeout((): void => {
                    const validationMessageNode = domNode.querySelector(".sdl-validationmessage");
                    expect(validationMessageNode).not.toBeNull("Could not find validation message.");
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

                dataStoreMock.setMockDataToc(null, [first, second]);
                this._renderComponent(target);

                const assert = (item: ISitemapItem, ready: () => void): void => {
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    // Use a timeout to allow the DataStore to return a promise with the data
                    setTimeout((): void => {
                        const tocItems = domNode.querySelector(".sdl-treeview ul");
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
        return ReactDOM.render(
            (<PublicationContent dataStore={dataStoreMock} routing={routing} publicationId={"ish:123-1-1"} />)
            , target) as PublicationContent;
    }
}

new PublicationContentComponent().runTests();
