import { Router, Route } from "react-router";
import { Breadcrumbs, IBreadcrumbsProps } from "../../../../src/components/presentation/Breadcrumbs";
import { ISitemapItem } from "../../../../src/interfaces/ServerModels";
import { Promise } from "es6-promise";
import { hashHistory } from "react-router";
import { Url } from "../../../../src/utils/Url";
import { TcmId } from "../../../../src/utils/TcmId";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

interface IProps {
    params: {
        publicationId: string;
        pageId?: string;
    };
}

const taxnomyId = "5";

const itemsPath: ISitemapItem[] = [
    {
        Id: TcmId.getTaxonomyItemId(taxnomyId, "1"),
        Title: "Root",
        IsAbstract: true,
        HasChildNodes: false,
        Items: []
    },
    {
        Id: TcmId.getTaxonomyItemId(taxnomyId, "2"),
        Title: "Child",
        Url: Url.getPageUrl("pub-id", "2"),
        IsAbstract: false,
        HasChildNodes: false,
        Items: []
    },
    {
        Id: TcmId.getTaxonomyItemId(taxnomyId, "3"),
        Title: "Selected",
        Url: Url.getPageUrl("pub-id", "3"),
        IsAbstract: false,
        HasChildNodes: false,
        Items: []
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

            const loadItemsPath = (publicationId: string, parentId: string): Promise<ISitemapItem[]> => {
                const itemsToReturn: ISitemapItem[] = [];
                for (let item of itemsPath) {
                    itemsToReturn.push(item);
                    if (item.Id === parentId) {
                        break;
                    }
                }
                return Promise.resolve(itemsToReturn);
            };

            beforeEach(() => {
                hashHistory.push(itemsPath[2].Url || "");
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
                target.parentElement.removeChild(target);
            });

            it("renders breadcumbs", (): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs);
                expect(domNode).not.toBeNull();
                const nodes = domNode.querySelectorAll("a");
                expect(nodes.length).toBe(1);
                expect(nodes.item(0).getAttribute("title")).toBe(data.publicationTitle);
            });

            it("renders breadcrumbs for selected item", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs);
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const nodes = domNode.querySelectorAll("a");
                    expect(nodes.length).toBe(3);
                    expect(nodes.item(0).textContent).toBe(data.publicationTitle);
                    expect(nodes.item(1).textContent).toBe(itemsPath[0].Title);
                    expect(nodes.item(2).textContent).toBe(itemsPath[1].Title);

                    // Last item is the selected item and should not highlighted with Link
                    const spanNodes = domNode.querySelectorAll("span");
                    expect(spanNodes.length).toBe(1);
                    expect(spanNodes.item(0).textContent).toBe(itemsPath[2].Title);

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
                    const updatedHyperlinksNodes = domNode.querySelectorAll("a");
                    expect(updatedHyperlinksNodes.length).toBe(1);
                    expect(updatedHyperlinksNodes[0].textContent).toBe(data.publicationTitle);

                    done();
                }, 0);
            });

            it("navigates to another item when a breadcrumb is clicked", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const hyperlinksNodes = domNode.querySelectorAll("a");
                    expect(hyperlinksNodes.length).toBe(3);

                    const childHyperlink = hyperlinksNodes[2] as HTMLElement;
                    expect(childHyperlink).toBeDefined();
                    if (childHyperlink) {
                        childHyperlink.click();

                        // Use a timeout to allow the promise with the data to be finished
                        setTimeout((): void => {
                            // Validate
                            const selectedItem = itemsPath[1];
                            const updatedItems = domNode.querySelectorAll("li");
                            expect(updatedItems.length).toBe(3);
                            expect(updatedItems[0].querySelector("a")).not.toBeNull();
                            expect(updatedItems[0].textContent).toBe(data.publicationTitle);
                            expect(updatedItems[1].querySelector("a")).not.toBeNull();
                            expect(updatedItems[1].textContent).toBe(itemsPath[0].Title);
                            expect(updatedItems[2].querySelector("a")).toBeNull();
                            expect(updatedItems[2].textContent).toBe(selectedItem.Title);

                            done();
                        }, 0);
                    }
                }, 0);
            });
        });
    }

    private _renderComponent(props: IBreadcrumbsProps, target: HTMLElement): Breadcrumbs {
        const getSelectedItem = (pageId?: string): ISitemapItem | null => {
            if (!pageId) {
                return null;
            }
            const taxonomyItemId = TcmId.getTaxonomyItemId(taxnomyId, pageId);
            return itemsPath.filter(item => item.Id === taxonomyItemId)[0];
        };

        return ReactDOM.render(
            <Router history={hashHistory}>
                <Route path=":publicationId(/:pageId)" component={(compProps: IProps) =>
                    (<Breadcrumbs selectedItem={getSelectedItem(compProps.params.pageId)} {...props} />)} />
            </Router>, target) as Breadcrumbs;
    }
}

new BreadcrumbsComponent().runTests();
