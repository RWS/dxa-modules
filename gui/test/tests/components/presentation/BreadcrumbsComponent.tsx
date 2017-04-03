import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route } from "react-router";
import { Breadcrumbs, IBreadcrumbsProps } from "components/presentation/Breadcrumbs";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Promise } from "es6-promise";
import { hashHistory } from "react-router";
import { Url } from "utils/Url";
import { TcmId } from "utils/TcmId";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "sdl-models";
import { TaxonomyItemId } from "interfaces/TcmId";

interface IProps {
    params: {
        publicationId: string;
        pageId?: string;
    };
}

const taxonomyItemId: TaxonomyItemId = TaxonomyItemId.Toc;

const itemsPath: ITaxonomy[] = [
    {
        id: TcmId.getTaxonomyItemId(taxonomyItemId, "1"),
        title: "Root",
        hasChildNodes: false
    },
    {
        id: TcmId.getTaxonomyItemId(taxonomyItemId, "2"),
        title: "Child",
        url: Url.getPageUrl("pub-id", "2"),
        hasChildNodes: false
    },
    {
        id: TcmId.getTaxonomyItemId(taxonomyItemId, "3"),
        title: "Selected",
        url: Url.getPageUrl("pub-id", "3"),
        hasChildNodes: false
    }
];

class BreadcrumbsComponent extends TestBase {

    public runTests(): void {

        describe(`Breadcrumbs tests`, (): void => {
            const target = super.createTargetElement();
            let breadCrumbs: Breadcrumbs;

            const data = {
                publicationId: "ish:777-1-1",
                publicationTitle: "Publication"
            };

            const loadItemsPath = (publicationId: string, pageId: string, parentId: string): Promise<ITaxonomy[]> => {
                const itemsToReturn: ITaxonomy[] = [];
                for (let item of itemsPath) {
                    itemsToReturn.push(item);
                    if (item.id === parentId) {
                        break;
                    }
                }
                return Promise.resolve(itemsToReturn);
            };

            beforeEach(() => {
                hashHistory.push(itemsPath[2].url || "");
                const props: IBreadcrumbsProps = {
                    publicationId: data.publicationId,
                    publicationTitle: data.publicationTitle,
                    loadItemsPath: loadItemsPath
                };
                breadCrumbs = this._renderComponent(props, target);
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders breadcumbs", (): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs);
                expect(domNode).not.toBeNull();
                const nodes = domNode.querySelectorAll(".home, a");
                expect(nodes.length).toBe(2);
                expect(nodes.item(0).getAttribute("title")).toBe("mock-components.breadcrumbs.home");
                expect(nodes.item(1).getAttribute("title")).toBe(data.publicationTitle);
            });

            it("renders breadcrumbs for selected item", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs);
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll(".home, .abstract, a");
                    expect(nodes.length).toBe(4);
                    expect(nodes.item(0).getAttribute("title")).toBe("mock-components.breadcrumbs.home");
                    expect(nodes.item(1).textContent).toBe(data.publicationTitle);
                    expect(nodes.item(2).textContent).toBe(itemsPath[0].title);
                    expect(nodes.item(3).textContent).toBe(itemsPath[1].title);

                    // Last item is the selected item and should not highlighted with Link
                    const spanNodes = domNode.querySelectorAll("span.active");
                    expect(spanNodes.length).toBe(1);
                    expect(spanNodes.item(0).textContent).toBe(itemsPath[2].title);

                    done();
                }, 0);
            });

            it("navigates to publication root when a publication title breadcrumb is clicked", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const hyperlinksNodes = domNode.querySelectorAll("a");
                    const hyperlink = hyperlinksNodes.item(0) as HTMLAnchorElement;

                    expect(hyperlink).toBeDefined();

                    // Update selected item, this will be used after hyperlink click triggers a re-render
                    hyperlink.click();

                    // Validate
                    const updatedHyperlinksNodes = domNode.querySelectorAll(".home, a");
                    expect(updatedHyperlinksNodes.length).toBe(2);
                    expect(updatedHyperlinksNodes[0].textContent).toBe("mock-components.breadcrumbs.home");
                    expect(updatedHyperlinksNodes[1].textContent).toBe(data.publicationTitle);

                    done();
                }, 0);
            });

            it("navigates to another item when a breadcrumb is clicked", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const hyperlinksNodes = domNode.querySelectorAll(".home, .abstract, a");
                    expect(hyperlinksNodes.length).toBe(4);

                    const childHyperlink = hyperlinksNodes[3] as HTMLElement;
                    expect(childHyperlink).toBeDefined();
                    if (childHyperlink) {
                        childHyperlink.click();

                        // Use a timeout to allow the promise with the data to be finished
                        setTimeout((): void => {
                            // Validate
                            const selectedItem = itemsPath[1];
                            const updatedItems = domNode.querySelectorAll("li");
                            expect(updatedItems.length).toBe(4);
                            expect(updatedItems[0].querySelector(".home")).not.toBeNull();
                            expect(updatedItems[0].textContent).toBe("mock-components.breadcrumbs.home");
                            expect(updatedItems[1].querySelector("a")).not.toBeNull();
                            expect(updatedItems[1].textContent).toBe(data.publicationTitle);
                            expect(updatedItems[2].querySelector(".abstract")).not.toBeNull();
                            expect(updatedItems[2].textContent).toBe(itemsPath[0].title);
                            expect(updatedItems[3].querySelector("a")).toBeNull();
                            expect(updatedItems[3].textContent).toBe(selectedItem.title);

                            done();
                        }, 0);
                    }
                }, 0);
            });
        });
    }

    private _renderComponent(props: IBreadcrumbsProps, target: HTMLElement): Breadcrumbs {
        const getSelectedItem = (pageId?: string): ITaxonomy | null => {
            if (!pageId) {
                return null;
            }
            const taxonomyId = TcmId.getTaxonomyItemId(taxonomyItemId, pageId);
            return itemsPath.filter(item => item.id === taxonomyId)[0];
        };

        const comp = ReactDOM.render(
            <Router history={hashHistory}>
                <Route path=":publicationId(/:pageId)" component={(compProps: IProps) =>
                    (<ComponentWithContext><Breadcrumbs selectedItem={getSelectedItem(compProps.params.pageId)} {...props} /></ComponentWithContext>)} />
            </Router>, target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, Breadcrumbs) as Breadcrumbs;
    }
}

new BreadcrumbsComponent().runTests();
