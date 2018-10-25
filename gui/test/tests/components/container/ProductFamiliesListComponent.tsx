import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import {
    ProductFamiliesListPresentation,
    IProductFamiliesListProps
} from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesListPresentation";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { browserHistory } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";

import { RENDER_DELAY } from "test/Constants";

const services = {
    publicationService: new PublicationService()
};

class ProductFamiliesListComponent extends TestBase {
    public runTests(): void {
        const defaultProps: IProductFamiliesListProps = {
            error: "",
            productFamilies: [
                {
                    title: "Product Family"
                }
            ],
            isLoading: false
        };

        describe(`ProductFamiliesList component tests.`, (): void => {
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

            it("shows loading indicator", (): void => {
                const productFamiliesList = this._renderComponent(target, { ...defaultProps, isLoading: true });
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                    productFamiliesList,
                    // tslint:disable-next-line:no-any
                    ActivityIndicator as any
                );
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows no publications message when list fo publiactions is empty", (): void => {
                const productFamiliesList = this._renderComponent(target, { ...defaultProps, productFamilies: [] });
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                    productFamiliesList,
                    // tslint:disable-next-line:no-any
                    ActivityIndicator as any
                );
                expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                const noContentNode = domNode.querySelector(".no-available-publications-label");
                expect(noContentNode && noContentNode.textContent).toBe(
                    "mock-components.productfamilies.no.published.publications"
                );
            });

            it("shows an error message when product families list fails to load", (): void => {
                const error = "Families list failed to load!";
                const productFamiliesList = this._renderComponent(target, { ...defaultProps, error });
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(
                    productFamiliesList,
                    // tslint:disable-next-line:no-any
                    ActivityIndicator as any
                );
                expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                expect(errorElement).not.toBeNull("Error dialog not found");
                const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                expect(errorTitle.textContent).toEqual("mock-error.default.title");
                const buttons = (errorElement as HTMLElement).querySelectorAll(
                    ".sdl-dita-delivery-button-group button"
                );
                expect(buttons.length).toEqual(1);
            });

            it("Retries loading when error retry button is clicked", (done: () => void): void => {
                const error = "ERROR";
                const productFamiliesList = this._renderComponent(target, {
                    ...defaultProps,
                    error,
                    fetchProductFamilies: () => {
                        done();
                }});

                const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                const buttons = domNode.querySelectorAll("button");
                expect(buttons.length).toEqual(1);
                const button = buttons[0] as HTMLButtonElement;
                expect(button).toBeDefined("Retry loading button is not defined");
                expect(button.textContent).toEqual("mock-control.button.retry");

                TestUtils.Simulate.click(button);
            });

            it("renders product families tiles", (): void => {
                const productFamilies = [
                    {
                        title: "Product Family 1"
                    },
                    {
                        title: "Product Family 2 with Warning",
                        hasWarning: true
                    }
                ];

                const productFamiliesList = this._renderComponent(target, { ...defaultProps, productFamilies });

                const header = TestUtils.scryRenderedDOMComponentsWithTag(productFamiliesList, "h3");
                expect(header.length).toBe(2);

                expect(header[0].textContent).toBe(productFamilies[0].title);
                expect(header[1].textContent).toBe("mock-productfamilies.unknown.title");
                expect(header[1].classList).toContain("exclamation-mark");
            });

            it("navigates to publications list when a product family `view more` button is clicked", (
                done: () => void
            ): void => {
                const productFamiliesList = this._renderComponent(target, defaultProps);
                const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Spy on the router
                spyOn(browserHistory, "push").and.callFake((path: string): void => {
                    // Check if routing was called with correct params
                    expect(path).toBe(`/publications/Product%20Family`);
                    done();
                });

                // Use a timeout to allow the DataStore to return a promise with the data
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const button = TestUtils.findRenderedComponentWithType(productFamiliesList, Button as any);
                    expect(button).toBeDefined();
                    const buttonEl = ReactDOM.findDOMNode(button).querySelector("button") as HTMLElement;
                    buttonEl.click();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement, props: IProductFamiliesListProps): ProductFamiliesListPresentation {
        const store = configureStore({});
        const comp = ReactDOM.render(
            <Provider store={store}>
                <ComponentWithContext {...services}>
                    <ProductFamiliesListPresentation {...props} />
                </ComponentWithContext>
            </Provider>,
            target
        ) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(
            comp,
            ProductFamiliesListPresentation
        ) as ProductFamiliesListPresentation;
    }
}

new ProductFamiliesListComponent().runTests();
