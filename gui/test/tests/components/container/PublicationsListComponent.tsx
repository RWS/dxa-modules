import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Store } from "redux";
import { Provider } from "react-redux";
import { browserHistory } from "react-router";
import {
    PublicationsListPresentation,
    IPublicationsListProps,
    IPublicationsListPropsParams
} from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import { PublicationsList } from "@sdl/dd/PublicationsList/PublicationsList";
import { ActivityIndicator, Button, DropdownList } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { IPublication } from "interfaces/Publication";
import { configureStore } from "store/Store";
import { IState } from "src/store/interfaces/State";

import { RENDER_DELAY, ASYNC_TEST_DELAY } from "test/Constants";

const services = {
    publicationService: new PublicationService(),
    taxonomyService: new TaxonomyService()
};

class PublicationsListComponent extends TestBase {
    private store: Store<IState>;
    public runTests(): void {
        describe(`PublicationsList component tests.`, (): void => {
            const target = super.createTargetElement();

            beforeEach(() => {
                this.store = configureStore();
                services.publicationService.fakeDelay(true);
            });

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
                //const publicationsList = this._renderComponent(target, { ...defaultProps, isLoading: true });
                const publicationsList = this._renderComponent(target);

                const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                    publicationsList,
                    // tslint:disable-next-line:no-any
                    ActivityIndicator as any
                );
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows an error message when publications list fails to load", (done: () => void): void => {
                const publicationsLoadError = "Publications list failed to load!";
                services.publicationService.setMockDataPublications(publicationsLoadError);

                const publicationsList = this._renderComponent(target);

                setTimeout((): void => {
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                        publicationsList,
                        // tslint:disable-next-line:no-any
                        ActivityIndicator as any
                    );
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(publicationsList) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(
                        ".sdl-dita-delivery-button-group button"
                    );
                    expect(buttons.length).toEqual(1);

                    done();
                }, RENDER_DELAY);
            });

            it("renders only publications associated with product family", (done: () => void): void => {
                const publications: IPublication[] = Array(3)
                    .fill(null)
                    .map((n, i) => ({
                        id: `id-${i}`,
                        title: `Publication ${i}`,
                        createdOn: new Date(),
                        language: "en",
                        version: "1",
                        logicalId: `GUID-${i}`,
                        versionRef: `${i}`,
                        productFamily: "prod-family"
                    }));

                services.publicationService.setMockDataPublications(null, publications, [{ title: "prod-family" }]);

                this._renderComponent(target);

                setTimeout((): void => {
                    const domNode = ReactDOM.findDOMNode(target);
                    const h3 = domNode.querySelectorAll("h3");
                    expect(h3.length).toBe(3);

                    expect(h3[0].textContent).toBe(publications[0].title);
                    expect(h3[1].textContent).toBe(publications[1].title);
                    expect(h3[2].textContent).toBe(publications[2].title);

                    // TODO: Check if product family is changed

                    done();
                }, ASYNC_TEST_DELAY);
            });

            it("navigates to publication when a publication title is clicked", (done: () => void): void => {
                const publications: IPublication[] = [
                    {
                        id: "0",
                        title: "Publication",
                        createdOn: new Date(),
                        language: "en",
                        version: "1",
                        logicalId: "GUID-123",
                        productFamily: "prod-family"
                    }
                ];

                services.publicationService.setMockDataPublications(null, publications, [{ title: "prod-family" }]);
                const publicationsList = this._renderComponent(target);
                setTimeout((): void => {
                    const domNode = ReactDOM.findDOMNode(publicationsList) as HTMLElement;
                    expect(domNode).not.toBeNull();

                    // Spy on the router
                    spyOn(browserHistory, "push").and.callFake((path: string): void => {
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
                    }, RENDER_DELAY);
                }, ASYNC_TEST_DELAY);
            });

            it("shows first 5 topic titles in the root map of the publication", (done: () => void): void => {
                services.publicationService.setMockDataPublications(
                    null,
                    [
                        {
                            id: "0",
                            title: "Publication",
                            createdOn: new Date(),
                            language: "en",
                            version: "1",
                            logicalId: "GUID-123",
                            productFamily: "prod-family"
                        }
                    ],
                    [{ title: "prod-family" }]
                );

                services.taxonomyService.setMockDataToc(
                    null,
                    Array(7)
                        .fill(null)
                        .map((n, i) => ({
                            id: `id-${i}`,
                            title: `Title ${i}`,
                            description: `Tile ${i} Description`,
                            url: i == 3 ? undefined : `/url-${i}`,
                            hasChildNodes: false
                        }))
                );

                //const publicationsList = this._renderComponent(target, { ...defaultProps, publications });
                const publicationsList = this._renderComponent(target);

                setTimeout((): void => {
                    const links = TestUtils.scryRenderedDOMComponentsWithTag(publicationsList, "a");
                    expect(links.length).toBe(5);
                    // Title 3 is not added as it has no url to a page
                    expect(links[0].textContent).toBe("Title 0");
                    expect(links[1].textContent).toBe("Title 1");
                    expect(links[2].textContent).toBe("Title 2");
                    expect(links[3].textContent).toBe("Title 4");
                    expect(links[4].textContent).toBe("Title 5");
                    done();
                }, RENDER_DELAY);
            });

            it("can filter on publication release version", (done: () => void): void => {
                const productFamily = "prod-family-test";
                const productFamilies = [{ title: productFamily }];
                const productReleaseVersins = [
                    { title: "Release version 1", value: "prod-release-version-1" },
                    { title: "Release version 2", value: "prod-release-version-2" }
                ];
                services.publicationService.setMockDataPublications(
                    null,
                    [
                        {
                            id: "1",
                            title: "Publication1",
                            createdOn: new Date(),
                            version: "1",
                            logicalId: "GUID-1",
                            productFamily,
                            productReleaseVersion: productReleaseVersins[0].value,
                            language: "en"
                        },
                        {
                            id: "2",
                            title: "Publication2",
                            createdOn: new Date(),
                            version: "1",
                            logicalId: "GUID-1",
                            productFamily,
                            productReleaseVersion: productReleaseVersins[1].value,
                            language: "en"
                        }
                    ],
                    productFamilies,
                    productReleaseVersins
                );

                const publicationsList = this._renderComponent(target, {
                    productFamily
                });

                // Wait for services to return data
                setTimeout((): void => {
                    const releaseVersion = 1;
                    // tslint:disable-next-line:no-any
                    const dropdownList = TestUtils.findRenderedComponentWithType(publicationsList, DropdownList as any);
                    const dropdownListNode = ReactDOM.findDOMNode(dropdownList);
                    const listItems = dropdownListNode.querySelectorAll("li");
                    expect(listItems.length).toBe(2);

                    // Spy on the router
                    spyOn(browserHistory, "push").and.callFake((path: string): void => {
                        // Check if routing was called with correct params
                        expect(path).toBe(
                            `/publications/${productFamily}/${productReleaseVersins[releaseVersion].value}`
                        );
                        done();
                    });

                    // Click on the second release version
                    listItems[releaseVersion].click();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement, params?: IPublicationsListPropsParams): PublicationsListPresentation {
        const store = this.store as Store<IState>;
        const defaultProps: IPublicationsListProps = {
            error: "",
            publications: [],
            productReleaseVersions: [],
            selectedProductVersion: "",
            isLoading: false,
            uiLanguage: store.getState().language,
            params: params || ({ productFamily: "prod-family" } as IPublicationsListPropsParams)
        };
        const comp = ReactDOM.render(
            <Provider store={store}>
                <ComponentWithContext {...services}>
                    <PublicationsList {...defaultProps} />
                </ComponentWithContext>
            </Provider>,
            target
        ) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(
            comp,
            PublicationsListPresentation
        ) as PublicationsListPresentation;
    }
}

new PublicationsListComponent().runTests();
