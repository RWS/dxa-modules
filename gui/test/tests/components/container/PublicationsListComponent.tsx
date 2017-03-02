import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { PublicationsList } from "components/container/PublicationsList";
import { ActivityIndicator } from "sdl-controls-react-wrappers";
import { TestBase } from "sdl-models";
import { PublicationService } from "test/mocks/services/PublicationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

const services = {
    publicationService: new PublicationService()
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
                target.parentElement.removeChild(target);
            });

            it("show loading indicator on initial render", (): void => {
                const publicationsList = this._renderComponent(target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationsList, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(1, "Could not find activity indicators.");
            });

            it("shows an error message when publications list fails to load", (done: () => void): void => {
                const errorMessage = "Publications list failed to load!";
                services.publicationService.fakeDelay(true);
                services.publicationService.setMockDataPublications(errorMessage);
                const publicationsList = this._renderComponent(target);

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const activityIndicators = TestUtils.scryRenderedComponentsWithType(publicationsList, ActivityIndicator as any);
                    expect(activityIndicators.length).toBe(0, "Activity indicator should not be rendered.");

                    const domNode = ReactDOM.findDOMNode(publicationsList) as HTMLElement;
                    const errorElement = domNode.querySelector(".sdl-dita-delivery-error");
                    expect(errorElement).not.toBeNull("Error dialog not found");
                    const errorTitle = errorElement.querySelector("h1");
                    expect(errorTitle.textContent).toEqual("mock-error.default.title");
                    const buttons = errorElement.querySelectorAll(".sdl-dita-delivery-button-group button");
                    expect(buttons.length).toEqual(1);

                    done();
                }, 500);
            });

            it("renders only publications associated with product family", (done: () => void): void => {
                services.publicationService.fakeDelay(true);
                const publications = [{
                    id: "1",
                    title: "Publication 1"
                }, {
                    id: "2",
                    title: "Publication 2"
                }, {
                    id: "3",
                    title: "Publication 3"
                }];
                services.publicationService.setMockDataPublications(null, publications);

                const publicationsList = this._renderComponent(target);

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
                const publications = [{
                    id: "0",
                    title: "Publication"
                }];
                services.publicationService.setMockDataPublications(null, publications);

                const publicationsList = this._renderComponent(target);
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
                    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(publicationsList, "button");
                    const button = buttons[0] as HTMLButtonElement;
                    expect(button).toBeDefined();
                    TestUtils.Simulate.click(button);
                }, 0);
            });

        });
    }

    private _renderComponent(target: HTMLElement, productFamily?: string): PublicationsList {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <PublicationsList params={{ productFamily: productFamily || "prod-family" }} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PublicationsList) as PublicationsList;
    }
}

new PublicationsListComponent().runTests();
