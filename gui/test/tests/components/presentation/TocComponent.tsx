import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Toc, ITocProps } from "components/presentation/Toc";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Promise } from "es6-promise";
import { TreeView } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

class TocComponent extends TestBase {

    public runTests(): void {

        describe(`Toc component tests.`, (): void => {
            const target = super.createTargetElement();
            let toc: Toc;

            const rootItems: ITaxonomy[] = [{
                id: "root",
                title: "Root1",
                hasChildNodes: true
            }, {
                id: "root-error",
                title: "Root2",
                hasChildNodes: true
            }];
            const loadChildItems = (parentId: string): Promise<ITaxonomy[]> => {
                if (parentId === "root") {
                    return Promise.resolve([{
                        id: "12345",
                        title: "Child1",
                        hasChildNodes: false
                    }]);
                } else {
                    return Promise.reject("Failed to load child nodes");
                }
            };

            beforeEach(() => {
                const props: ITocProps = {
                    loadChildItems: loadChildItems,
                    rootItems: rootItems,
                    onRetry: () => {
                        toc.setState({
                            error: null
                        });
                    }
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
                expect(nodes.item(0).textContent).toBe(rootItems[0].title);
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
                    expect(nodes.item(0).textContent).toBe(rootItems[0].title);
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
                    const node = domNode.querySelector(".sdl-dita-delivery-toc-list-fail");
                    expect(node).not.toBeNull();
                    expect(node.querySelector("p").textContent).toBe("mock-error.toc.items.not.found");
                    done();
                }, 0);
            });

            it("correct error component rendering", (done: () => void): void => {
                toc.setState({
                    error: "Oops, error!"
                });

                const element = document.querySelector(".sdl-dita-delivery-error-toc");
                expect(element).not.toBeNull();

                const message = element.querySelector(".sdl-dita-delivery-error-toc-message");
                expect(message.textContent).toEqual("mock-Oops, error!");

                element.querySelector("button").click();

                const element2 = document.querySelector(".sdl-dita-delivery-error-toc");
                expect(element2).toBeNull();
                done();
            });
        });

    }

    private _renderComponent(props: ITocProps, target: HTMLElement): Toc {
        const comp = ReactDOM.render(
            <ComponentWithContext>
                <Toc {...props} />
            </ComponentWithContext>, target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, Toc) as Toc;
    }
}

new TocComponent().runTests();
