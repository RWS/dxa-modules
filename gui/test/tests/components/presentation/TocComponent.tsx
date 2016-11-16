import { Toc, ITocProps } from "components/presentation/Toc";
import { ISitemapItem } from "interfaces/ServerModels";
import { Promise } from "es6-promise";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import TreeView = SDL.ReactComponents.TreeView;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;
const TestUtils = React.addons.TestUtils;

class TocComponent extends TestBase {

    public runTests(): void {

        describe(`Toc component tests.`, (): void => {
            const target = super.createTargetElement();
            let toc: Toc;

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
                toc = this._renderComponent(props, target);
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("shows the root nodes on initial render", (): void => {
                // tslint:disable-next-line:no-any
                const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                expect(treeView).not.toBeNull();
                const domNode = ReactDOM.findDOMNode(treeView);
                const nodes = domNode.querySelectorAll(".content");
                expect(nodes.length).toBe(2);
                expect(nodes.item(0).textContent).toBe(rootItems[0].Title);
            });

            it("expands the root node upon click", (done: () => void): void => {
                // tslint:disable-next-line:no-any
                const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                expect(treeView).not.toBeNull();
                const domNode = ReactDOM.findDOMNode(treeView);
                (domNode.querySelector(".expand-collapse") as HTMLDivElement).click();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll(".content");
                    expect(nodes.length).toBe(3);
                    expect(nodes.item(0).textContent).toBe(rootItems[0].Title);
                    expect(nodes.item(1).textContent).toBe("Child1");
                    done();
                }, 0);
            });

            it("shows an error when node failes to expand", (done: () => void): void => {
                // tslint:disable-next-line:no-any
                const treeView = TestUtils.findRenderedComponentWithType(toc, TreeView as any);
                expect(treeView).not.toBeNull();
                const domNode = ReactDOM.findDOMNode(treeView);
                (domNode.querySelectorAll(".expand-collapse").item(1) as HTMLDivElement).click();
                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll(".content");
                    expect(nodes.length).toBe(2);
                    // Check if validation message is shown
                    // tslint:disable-next-line:no-any
                    const validationMessage = TestUtils.findRenderedComponentWithType(toc, ValidationMessage as any);
                    expect(validationMessage).not.toBeNull();
                    const validationMessageNode = ReactDOM.findDOMNode(validationMessage);
                    expect(validationMessageNode.querySelector("label").textContent).toBe("Failed to load child nodes");
                    done();
                }, 0);
            });

        });

    }

    private _renderComponent(props: ITocProps, target: HTMLElement): Toc {
        return ReactDOM.render(<Toc {...props} />, target) as Toc;
    }
}

new TocComponent().runTests();
