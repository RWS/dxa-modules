import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorContent } from "components/container/ErrorContent/ErrorContent";
import { IErrorContentProps } from "components/container/ErrorContent/ErrorContentPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";

class ErrorContentComponent extends TestBase {

    public runTests(): void {

        describe(`Error page component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("Correct component render", (): void => {
                this._renderComponent({}, target);
                const errorPageElement = document.querySelector(".sdl-dita-delivery-error-page") as HTMLButtonElement;
                const errorButton = errorPageElement.querySelectorAll(".sdl-button") as NodeListOf<HTMLButtonElement>;
                const errorTitle = errorPageElement.querySelectorAll("h1");
                const errorMessage = errorPageElement.querySelectorAll("p");
                const searchBar = document.querySelector(".sdl-dita-delivery-searchbar");

                expect(searchBar).not.toBeNull();
                expect(errorPageElement).not.toBeNull();
                expect(errorButton.length).toBe(1);
                expect(errorButton.length).toBe(1);
                expect(errorTitle.item(0).textContent).toBe("mock-error.default.title");
                expect(errorMessage.item(0).textContent).toBe("mock-error.url.not.found");
            });

            it("Shows the status code when provided", (): void => {
                this._renderComponent({ error: { message: "Something went serioursly wrong!", statusCode: "500" } }, target);
                const errorPageElement = document.querySelector(".sdl-dita-delivery-error-page") as HTMLElement;
                const errorTitle = errorPageElement.querySelectorAll("h1");

                expect(errorPageElement).not.toBeNull();
                expect(errorTitle.item(0).textContent).toBe("500 - mock-error.default.title");
            });
        });
    }

    private _renderComponent(props: IErrorContentProps, target: HTMLElement): void {
        const store = configureStore();
        ReactDOM.render(<Provider store={store}><ComponentWithContext><ErrorContent {...props} /></ComponentWithContext></Provider>, target) as React.Component<{}, {}>;
    }
}

new ErrorContentComponent().runTests();
