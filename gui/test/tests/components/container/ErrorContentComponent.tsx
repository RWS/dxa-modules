/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorContent } from "@sdl/dd/container/ErrorContent/ErrorContent";
import { IErrorContentProps } from "@sdl/dd/container/ErrorContent/ErrorContentPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { browserHistory } from "react-router";
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

            it("Correct component render", (done: () => void): void => {
                this._renderComponent({}, target);
                const errorPageElement = document.querySelector(".sdl-dita-delivery-error-page") as HTMLButtonElement;
                const errorButton = errorPageElement.querySelectorAll(".sdl-button") as NodeListOf<HTMLButtonElement>;
                const errorTitle = errorPageElement.querySelectorAll("h1");
                const errorMessage = errorPageElement.querySelectorAll("p");
                const searchBar = document.querySelector(".sdl-dita-delivery-searchbar");

                expect(searchBar).not.toBeNull();
                expect(errorPageElement).not.toBeNull();

                expect(errorTitle.item(0).textContent).toBe("mock-error.default.title");
                expect(errorMessage.item(0).textContent).toBe("mock-error.url.not.found");

                spyOn(browserHistory, "push").and.callFake((): void => {
                    done();
                });

                expect(errorButton.length).toBe(1);
                errorButton[0].click();
            });

            it("Shows the status code when provided", (): void => {
                this._renderComponent(
                    { error: { message: "Something went serioursly wrong!", statusCode: "500" } },
                    target
                );
                const errorPageElement = document.querySelector(".sdl-dita-delivery-error-page") as HTMLElement;
                const errorTitle = errorPageElement.querySelectorAll("h1");

                expect(errorPageElement).not.toBeNull();
                expect(errorTitle.item(0).textContent).toBe("500 - mock-error.default.title");
            });
        });
    }

    private _renderComponent(props: IErrorContentProps, target: HTMLElement): void {
        const store = configureStore();
        ReactDOM.render(
            <Provider store={store}>
                <ComponentWithContext>
                    <ErrorContent {...props} />
                </ComponentWithContext>
            </Provider>,
            target
        ) as React.Component<{}, {}>;
    }
}

new ErrorContentComponent().runTests();
