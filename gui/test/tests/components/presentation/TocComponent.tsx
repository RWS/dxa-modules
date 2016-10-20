import { Toc, ITocProps } from "../../../../src/components/presentation/Toc";
import { ISitemapItem } from "../../../../src/interfaces/ServerModels";
import { Promise } from "es6-promise";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class TocComponent extends TestBase {

    public runTests(): void {

        describe(`Toc component tests.`, (): void => {
            const target = super.createTargetElement();
            const rootItems: ISitemapItem[] = [{
                Id: "root",
                Title: "Root1",
                IsAbstract: false,
                HasChildNodes: true,
                Items: []
            }, {
                Id: "root-error",
                Title: "Root2",
                IsAbstract: false,
                HasChildNodes: true,
                Items: []
            }];
            const loadChildItems = (parentId: string): Promise<ISitemapItem[]> => {
                if (parentId === "root") {
                    return Promise.resolve([{
                        Id: "12345",
                        Title: "Child1",
                        IsAbstract: false,
                        HasChildNodes: false,
                        Items: []
                    }]);
                } else {
                    return Promise.reject("Failed to load child nodes");
                }
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
                expect(nodes.length).toBe(2);
                expect(nodes.item(0).textContent).toBe("Root1");
            });

            it("expands the root node upon click", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                (domNode.querySelector(".sdl-treeview .expand-collapse") as HTMLDivElement).click();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(3);
                    expect(nodes.item(0).textContent).toBe("Root1");
                    expect(nodes.item(1).textContent).toBe("Child1");
                    done();
                }, 0);
            });

            it("shows an error when node failes to expand", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                (domNode.querySelectorAll(".sdl-treeview .expand-collapse").item(1) as HTMLDivElement).click();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll(".sdl-treeview .content");
                    expect(nodes.length).toBe(2);
                    // Check if validation message is shown
                    expect(domNode.querySelector(".sdl-validationmessage-message label").textContent).toBe("Failed to load child nodes");
                    done();
                }, 0);
            });

        });

    }

    private _renderComponent(props: ITocProps, target: HTMLElement): void {
        ReactDOM.render(<Toc {...props} />, target);
    }
}

new TocComponent().runTests();
