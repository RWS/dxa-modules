import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { PublicationsListPresentation } from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import { ActivityIndicator, Button, DropdownList } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { IPublication } from "interfaces/Publication";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";

const services = {
    publicationService: new PublicationService(),
    taxonomyService: new TaxonomyService()
};

class PublicationsListComponent extends TestBase {

    public runTests(): void {

        describe(`PublicationsList component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                services.publicationService.fakeDelay(false);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("show loading indicator on initial render", (): void => {
                const publicationsList = this._renderComponent(target, []);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationsList, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            xit("shows an error message when publications list fails to load", (done: () => void): void => {
                const errorMessage = "Publications list failed to load!";
                services.publicationService.fakeDelay(true);
                services.publicationService.setMockDataPublications(errorMessage);
                const publicationsList = this._renderComponent(target, []);

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationsList, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(publicationsList) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(".sdl-dita-delivery-button-group button");
                    expect(buttons.length).toEqual(1);

                    done();
                }, 500);
            });

            it("renders only publications associated with product family", (done: () => void): void => {
                services.publicationService.fakeDelay(true);
                const publications: IPublication[] = [{
                    id: "1",
                    title: "Publication 1",
                    createdOn: new Date(),
                    language: "en",
                    version: "1",
                    logicalId: "GUID-123",
                    productFamily: "prod-family"
                }, {
                    id: "2",
                    title: "Publication 2",
                    createdOn: new Date(),
                    language: "en",
                    version: "1",
                    logicalId: "GUID-123",
                    productFamily: "prod-family"
                }, {
                    id: "3",
                    title: "Publication 3",
                    createdOn: new Date(),
                    language: "en",
                    version: "1",
                    logicalId: "GUID-123",
                    productFamily: "prod-family"
                }];
                services.publicationService.setMockDataPublications(null, publications);

                const publicationsList = this._renderComponent(target, publications);

                setTimeout((): void => {
                    const h3 = TestUtils.scryRenderedDOMComponentsWithTag(publicationsList, "h3");
                    expect(h3.length).toBe(3);

                    expect(h3[0].textContent).toBe(publications[0].title);
                    expect(h3[1].textContent).toBe(publications[1].title);
                    expect(h3[2].textContent).toBe(publications[2].title);
                    done();
                }, 500);
            });

            it("navigates to publication when a publication title is clicked", (done: () => void): void => {
                const publications: IPublication[] = [{
                    id: "0",
                    title: "Publication",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-123",
                    productFamily: "prod-family"
                }];
                services.publicationService.setMockDataPublications(null, publications);

                const publicationsList = this._renderComponent(target, publications);
                const domNode = ReactDOM.findDOMNode(publicationsList) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Spy on the router
                spyOn(publicationsList.context.router, "push").and.callFake((path: string): void => {
                    // Check if routing was called with correct params
                    expect(path).toBe(`/0/publication`);
                    done();
                });

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const button = TestUtils.findRenderedComponentWithType(publicationsList, Button as any);
                    expect(button).toBeDefined();
                    const buttonEl = ReactDOM.findDOMNode(button).querySelector("button") as HTMLButtonElement;
                    buttonEl.click();
                }, 0);
            });

            it("shows first 5 topic titles in the root map of the publication", (done: () => void): void => {
                const publications: IPublication[] = [{
                    id: "0",
                    title: "Publication",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-123",
                    productFamily: "prod-family"
                }];
                // services.publicationService.setMockDataPublications(null, publications);
                services.taxonomyService.setMockDataToc(null, [
                    {
                        id: "1",
                        title: "Title 1",
                        url: "/url-1",
                        hasChildNodes: false
                    },
                    {
                        id: "2",
                        title: "Title 2",
                        url: "/url-2",
                        hasChildNodes: false
                    },
                    {
                        id: "3",
                        title: "Title 3",
                        hasChildNodes: false
                    },
                    {
                        id: "4",
                        title: "Title 4",
                        url: "/url-4",
                        hasChildNodes: false
                    },
                    {
                        id: "5",
                        title: "Title 5",
                        url: "/url-5",
                        hasChildNodes: false
                    },
                    {
                        id: "6",
                        title: "Title 6",
                        url: "/url-6",
                        hasChildNodes: false
                    },
                    {
                        id: "7",
                        title: "Title 7",
                        url: "/url-7",
                        hasChildNodes: false
                    }
                ]);

                const publicationsList = this._renderComponent(target, publications);

                setTimeout((): void => {
                    const links = TestUtils.scryRenderedDOMComponentsWithTag(publicationsList, "a");
                    expect(links.length).toBe(5);
                    // Title 3 is not added as it has no url to a page
                    expect(links[0].textContent).toBe("Title 1");
                    expect(links[1].textContent).toBe("Title 2");
                    expect(links[2].textContent).toBe("Title 4");
                    expect(links[3].textContent).toBe("Title 5");
                    expect(links[4].textContent).toBe("Title 6");
                    done();
                }, 0);
            });

            it("can filter on publication release version", (done: () => void): void => {
                const publications: IPublication[] = [{
                    id: "1",
                    title: "Publication1",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-1",
                    productFamily: "PF",
                    productReleaseVersion: "PR1",
                    language: "en"
                }, {
                    id: "2",
                    title: "Publication2",
                    createdOn: new Date(),
                    version: "1",
                    logicalId: "GUID-1",
                    productFamily: "PF",
                    productReleaseVersion: "PR2",
                    language: "en"
                }];

                const publicationsList = this._renderComponent(target, publications, "PF",
                    [{ title: "PR1", value: "pr1" }, { title: "PR2", value: "pr2" }]);

                // Wait for services to return data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const dropdownList = TestUtils.findRenderedComponentWithType(publicationsList, DropdownList as any);
                    const dropdownListNode = ReactDOM.findDOMNode(dropdownList);
                    const listItems = dropdownListNode.querySelectorAll("li");
                    expect(listItems.length).toBe(2);

                    // Spy on the router
                    spyOn(publicationsList.context.router, "push").and.callFake((path: string): void => {
                        // Check if routing was called with correct params
                        expect(path).toBe(`/publications/PF/pr2`);
                        done();
                    });

                    // Click on the second release version
                    listItems[1].click();
                }, 0);
            });

        });
    }

    private _renderComponent(target: HTMLElement, publications: IPublication[],
        productFamily?: string, productReleaseVersions: IProductReleaseVersion[] = []): PublicationsListPresentation {
        const store = configureStore({});
        const selectedProductVersion = productReleaseVersions[0] ? productReleaseVersions[0].title : "";
        const comp = ReactDOM.render(
            (
                <Provider store={store}>
                    <ComponentWithContext {...services}>
                        <PublicationsListPresentation
                            publications={publications}
                            productReleaseVersions={productReleaseVersions || []}
                            selectedProductVersion={selectedProductVersion}
                            isLoading={!publications.length}
                            uiLanguage="en"
                            params={{ productFamily: productFamily || "prod-family" }} />
                    </ComponentWithContext>
                </Provider>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PublicationsListPresentation) as PublicationsListPresentation;
    }
}

new PublicationsListComponent().runTests();
