import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { ProductFamiliesList } from "components/container/ProductFamiliesList";
import { ActivityIndicator, Button } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

const services = {
    publicationService: new PublicationService()
};

class ProductFamiliesListComponent extends TestBase {

    public runTests(): void {

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

            it("show loading indicator on initial render", (): void => {
                const productFamiliesList = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(productFamiliesList, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows an error message when product families list fails to load", (done: () => void): void => {
                const errorMessage = "Families list failed to load!";
                services.publicationService.fakeDelay(true);
                services.publicationService.setMockDataPublications(errorMessage);
                const productFamiliesList = this._renderComponent(target);

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(productFamiliesList, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = (errorElement as HTMLElement).querySelector("h1") as HTMLElement;
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = (errorElement as HTMLElement).querySelectorAll(".sdl-dita-delivery-button-group button");
                    expect(buttons.length).toEqual(1);

                    done();
                }, 200);
            });

            it("Retries loading when error retry button is clicked", (done: () => void): void => {
                services.publicationService.setMockDataPublications("ERROR");
                const productFamiliesList = this._renderComponent(target);

                setTimeout((): void => {
                    const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                    const buttons = domNode.querySelectorAll("button");
                    expect(buttons.length).toEqual(1);
                    const button = buttons[0] as HTMLButtonElement;
                    expect(button).toBeDefined("Retry loading button is not defined");
                    expect(button.textContent).toEqual("mock-control.button.retry");

                    const productFamilies = [{
                        title: "Product Family"
                    }];
                    services.publicationService.setMockDataPublications(null, [], productFamilies);
                    button.click();

                    setTimeout((): void => {
                        const headers = TestUtils.scryRenderedDOMComponentsWithTag(productFamiliesList, "h3");
                        expect(headers.length).toBe(1);
                        expect(headers[0].textContent).toBe(productFamilies[0].title);

                        done();
                    }, 0);
                }, 0);
            });

            it("renders product families tiles", (done: () => void): void => {
                services.publicationService.fakeDelay(true);
                const productFamilies = [{
                    title: "Product Family 1"
                }, {
                    title: "Product Family 2"
                }];
                services.publicationService.setMockDataPublications(null, [], productFamilies);

                const productFamiliesList = this._renderComponent(target);

                setTimeout((): void => {
                    const hyperlinks = TestUtils.scryRenderedDOMComponentsWithTag(productFamiliesList, "h3");
                    expect(hyperlinks.length).toBe(2);

                    expect(hyperlinks[0].textContent).toBe(productFamilies[0].title);
                    expect(hyperlinks[1].textContent).toBe(productFamilies[1].title);

                    done();
                }, 500);
            });

            it("navigates to publications list when a product family `view more` button is clicked", (done: () => void): void => {
                const productFamilies = [{
                    title: "Product Family"
                }];
                services.publicationService.setMockDataPublications(null, [], productFamilies);

                const productFamiliesList = this._renderComponent(target);
                const domNode = ReactDOM.findDOMNode(productFamiliesList) as HTMLElement;
                expect(domNode).not.toBeNull();

                // Spy on the router
                spyOn(productFamiliesList.context.router, "push").and.callFake((path: string): void => {
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
                }, 0);
            });

        });
    }

    private _renderComponent(target: HTMLElement, productFamily?: string): ProductFamiliesList {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <ProductFamiliesList />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, ProductFamiliesList) as ProductFamiliesList;
    }

}

new ProductFamiliesListComponent().runTests();
