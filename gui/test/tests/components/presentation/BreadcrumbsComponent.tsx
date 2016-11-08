import { Breadcrumbs, IBreadcrumbsProps } from "../../../../src/components/presentation/Breadcrumbs";
import { ISitemapItem } from "../../../../src/interfaces/ServerModels";
import { Promise } from "es6-promise";
import { routing } from "../../../mocks/Routing";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class BreadcrumbsComponent extends TestBase {

    public runTests(): void {

        describe(`Breadcrumbs tests`, (): void => {
            const target = super.createTargetElement();
            let breadCrumbs: Breadcrumbs;

            const data = {
                publicationId: "ish:777-1-1",
                publicationTitle: "Publication"
            };

            const selectedItem: ISitemapItem = {
                Id: "s-9",
                Title: "Selected",
                Url: "ish:5-15-99",
                IsAbstract: false,
                HasChildNodes: false,
                Items: []
            };

            const itemsPath: ISitemapItem[] = [{
                Id: "r-5",
                Title: "Root",
                IsAbstract: false,
                HasChildNodes: true,
                Items: []
            },
            {
                Id: "ch-6",
                Title: "Child",
                Url: "ish:5-15-66",
                IsAbstract: false,
                HasChildNodes: true,
                Items: []
            },
                selectedItem
            ];

            const loadItemsPath = (parentId: string, publicationId: string): Promise<ISitemapItem[]> => {
                return Promise.resolve(itemsPath);
            };

            beforeEach(() => {
                routing.setPublicationLocation(data.publicationId, data.publicationTitle);
                const props: IBreadcrumbsProps = {
                    routing: routing,
                    publicationId: data.publicationId,
                    publicationTitle: data.publicationTitle,
                    loadItemsPath: loadItemsPath,
                    selectedItem: selectedItem
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
                    expect(spanNodes.item(0).textContent).toBe(selectedItem.Title);
                    done();
                }, 0);
            });

            it("navigates to publication root when a publication title breadcrumb is clicked", (done: () => void): void => {
                const domNode = ReactDOM.findDOMNode(breadCrumbs) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    const hyperlinksNodes = domNode.querySelectorAll("a");
                    const hyperlink = hyperlinksNodes.item(0) as HTMLElement;

                    expect(hyperlink).toBeDefined();
                    hyperlink.click();

                    const location = routing.getPublicationLocation();
                    expect(location).toBeDefined();
                    if (location) {
                        expect(location.publicationId).toBe(data.publicationId);
                        expect(location.pageId).toBe(null);
                    }

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

                    for (let i: number = hyperlinksNodes.length - 1; i > 0; i--) {
                        const hyperlink = hyperlinksNodes.item(i) as HTMLElement;
                        expect(hyperlink).toBeDefined();
                        if (hyperlink) {
                            hyperlink.click();

                            const location = routing.getPublicationLocation();
                            expect(location).toBeDefined();
                            if (location) {
                                expect(location.publicationId).toBe(data.publicationId);
                                expect(location.pageId).toBe(itemsPath[i - 1].Url || null);
                            }
                        }
                    };

                    done();
                }, 0);
            });
        });
    }

    private _renderComponent(props: IBreadcrumbsProps, target: HTMLElement): Breadcrumbs {
        return ReactDOM.render(<Breadcrumbs {...props} />, target) as Breadcrumbs;
    }
}

new BreadcrumbsComponent().runTests();
