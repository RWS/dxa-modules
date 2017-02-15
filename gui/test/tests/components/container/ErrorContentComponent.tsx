import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorContent, IErrorContentProps } from "components/container/ErrorContent";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "sdl-models";

class ErrorContentComponent extends TestBase {

    public runTests(): void {

        describe(`Error page component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("Correct component render", (): void => {
                this._renderComponent({}, target);
                const errorPageElement = document.querySelector(".sdl-dita-delivery-error-page");
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
        });
    }

    private _renderComponent(props: IErrorContentProps, target: HTMLElement): void {
        ReactDOM.render(<ComponentWithContext><ErrorContent {...props} /></ComponentWithContext>, target) as React.Component<{}, {}>;
    }
}

new ErrorContentComponent().runTests();
