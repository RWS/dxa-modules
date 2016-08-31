/// <reference path="../../../../src/components/container/App.tsx" />

module Sdl.DitaDelivery.Tests {

    import Toc = Components.Toc;
    import ITocProps = Components.ITocProps;
    import ISitemapItem = Server.Models.ISitemapItem;

    class TocComponent extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Toc component tests.`, (): void => {
                const target = super.createTargetElement();
                const rootItems: ISitemapItem[] = [{
                    Id: "123",
                    Title: "Root",
                    IsAbstract: false,
                    IsLeaf: false,
                    Url: null
                }];
                const loadChildItems = (parentId: string, callback: (error: string, children: ISitemapItem[]) => void): void => {
                    callback(null, [{
                        Id: "12345",
                        Title: "Child1",
                        IsAbstract: false,
                        IsLeaf: true,
                        Url: null
                    }]);
                };

                beforeEach(() => {
                    const props: ITocProps = {
                        loadChildItems: loadChildItems,
                        rootItems: rootItems
                    };
                    this._renderComponent(props, target);
                });

                afterEach(() => {
                    const domNode = ReactDOM.findDOMNode(target);
                    ReactDOM.unmountComponentAtNode(domNode);
                });

                afterAll(() => {
                    target.parentElement.removeChild(target);
                });

                it("shows the root nodes on initial render", (): void => {
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(1);
                    expect(nodes.item(0).textContent).toBe("Root");
                });

                it("expands the root node upon click", (): void => {
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    (domNode.querySelector(".sdl-treeview .expand-collapse") as HTMLDivElement).click();
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(2);
                    expect(nodes.item(0).textContent).toBe("Root");
                    expect(nodes.item(1).textContent).toBe("Child1");
                });

            });

        }

        private _renderComponent(props: ITocProps, target: HTMLElement): void {
            ReactDOM.render(<Toc {...props}/>, target);
        }
    }

    new TocComponent().runTests();
}
