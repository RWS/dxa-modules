import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalErrorPage, IGlobalErrorPageProps } from "components/presentation/GlobalErrorPage";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "sdl-models";

class GlobalErrorPageComponent extends TestBase {

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
                expect(errorTitle.item(0).textContent).toBe("mock-error.page.not.found.title");
                expect(errorMessage.item(0).textContent).toBe("mock-error.page.not.found");
                expect(errorMessage.item(1).textContent).toBe("mock-error.default.message");

                errorButton.item(0).click();
                setTimeout(() => {
                    const noErrorPageElement = document.querySelector(".sdl-dita-delivery-error-page");
                    expect(noErrorPageElement).toBeNull();
                }, 0);
            });
        });
    }

    private _renderComponent(props: IGlobalErrorPageProps, target: HTMLElement): void {
        ReactDOM.render(<ComponentWithContext><GlobalErrorPage {...props} /></ComponentWithContext>, target) as React.Component<{}, {}>;
    }
}

new GlobalErrorPageComponent().runTests();
