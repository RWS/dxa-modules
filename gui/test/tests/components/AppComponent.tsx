/// <reference path="../../../src/components/App.tsx" />

module Sdl.DitaDelivery.Tests {

    import App = Components.App;
    import IAppProps = Components.IAppProps;
    import ILocalization = Components.ILocalization;

    class AppComponent extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`App component tests.`, (): void => {
                const target = super.createTargetElement();
                const localization: ILocalization = {
                    formatMessage: (path, variables) => SDL.Globalize.formatMessage(path, variables)
                };

                afterEach(() => {
                    const domNode = ReactDOM.findDOMNode(target);
                    ReactDOM.unmountComponentAtNode(domNode);
                });

                afterAll(() => {
                    target.parentElement.removeChild(target);
                });

                it("show loading indicator on initial render", (): void => {
                    this._renderComponent({ localization: localization }, target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                });

                it("shows toc", (): void => {
                    this._renderComponent({
                        localization: localization, toc: {
                            rootItems: [
                                {
                                    Id: "123",
                                    Title: "First element",
                                    IsAbstract: false,
                                    IsLeaf: false,
                                    Url: null
                                }
                            ],
                            loadChildItems: null
                        }
                    }, target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(1);
                    expect(nodes.item(0).textContent).toBe("First element");
                });

                it("updates page content when selected site map item changes", (): void => {
                    const pageContent = "<div>Page content!</div>";
                    const appComponent = this._renderComponent({
                        localization: localization, toc: {
                            rootItems: [],
                            loadChildItems: null
                        },
                        getPageContent: (pageId, callback): void => {
                            callback(null, pageContent);
                        }
                    }, target);
                    appComponent.setState({
                        selectedSiteMapItem: {
                            Id: "123",
                            IsAbstract: false,
                            IsLeaf: true,
                            Title: "Some page",
                            Url: "page"
                        }
                    });
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    expect(pageContentNode.children.length).toBe(1);
                    expect(pageContentNode.innerHTML).toBe(pageContent);
                });

                it("updates page content when item is selected from toc", (done: () => void): void => {
                    this._renderComponent({
                        localization: localization, toc: {
                            rootItems: [
                                {
                                    Id: "1",
                                    Title: "First element",
                                    IsAbstract: true,
                                    IsLeaf: true,
                                    Url: null
                                },
                                {
                                    Id: "2",
                                    Title: "Second element",
                                    IsAbstract: true,
                                    IsLeaf: true,
                                    Url: null
                                }
                            ],
                            loadChildItems: null
                        }
                    }, target);

                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    // Click second element
                    (domNode.querySelectorAll(".sdl-treeview .content")[1] as HTMLDivElement).click();

                    // Treeview uses debouncing for node selection so a timeout is required
                    setTimeout((): void => {
                        expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                        const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                        expect(pageContentNode).not.toBeNull("Could not find page content.");
                        expect(pageContentNode.innerHTML).toBe("Second element"); // page title
                        done();
                    }, 200);
                });

                it("updates page content with title when a site map item without url is selected", (): void => {
                    const title = "Some page";
                    const appComponent = this._renderComponent({
                        localization: localization, toc: {
                            rootItems: [],
                            loadChildItems: null
                        }
                    }, target);
                    appComponent.setState({
                        selectedSiteMapItem: {
                            Id: "12345",
                            IsAbstract: true,
                            IsLeaf: true,
                            Title: title,
                            Url: null
                        },
                        pageContent: title
                    });
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    expect(pageContentNode.children.length).toBe(0);
                    expect(pageContentNode.innerHTML).toBe(title);
                });

                xit("shows an error message when page content fails to load", (done: () => void): void => {
                    this._renderComponent({
                        localization: localization,
                        toc: {
                            rootItems: [{
                                Id: "123456",
                                IsAbstract: false,
                                IsLeaf: true,
                                Title: "Some page",
                                Url: "page-url"
                            }],
                            loadChildItems: null
                        },
                        getPageContent: (pageId, callback): void => {
                            callback("Page failed to load!", "");
                        }
                    }, target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    setTimeout((): void => {
                        expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should not be rendered.");
                        const validationMessageNode = domNode.querySelector(".sdl-validationmessage");
                        expect(validationMessageNode).not.toBeNull("Could not find validation message.");
                        expect(validationMessageNode.textContent).toBe("Page failed to load!");
                        done();
                    }, 100);
                });

            });

        }

        private _renderComponent(props: IAppProps, target: HTMLElement): App {
            return ReactDOM.render(<App {...props}/>, target) as App;
        }
    }

    new AppComponent().runTests();
}
