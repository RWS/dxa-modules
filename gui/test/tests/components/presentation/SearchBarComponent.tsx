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
import * as TestUtils from "react-addons-test-utils";
import { SearchBar, ISearchBarProps } from "@sdl/dd/presentation/SearchBar";
import { TestBase } from "@sdl/models";
import { KeyCodes } from "utils/Keys";

class SearchBarComponent extends TestBase {

    public runTests(): void {

        describe(`Search Bar component tests.`, (): void => {
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

            it("shows placeholder text", (): void => {
                const placeholderLabel = "Hello world!";
                this._renderComponent({
                    placeholderLabel: placeholderLabel
                }, target);
                const input = document.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
                expect(input.getAttribute("placeholder")).toBe(placeholderLabel);
            });

            it("triggers search on enter key press", (done: () => void): void => {
                const searchQuery = "search on enter key press";
                this._renderComponent({
                    placeholderLabel: "",
                    onSearch: query => {
                        expect(query).toBe(searchQuery);
                        done();
                    }
                }, target);
                const input = document.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
                input.value = searchQuery;
                TestUtils.Simulate.keyUp(input, {
                    keyCode: KeyCodes.Enter
                });
            });

            it("triggers search on search button click", (done: () => void): void => {
                const searchQuery = "search on button click";
                this._renderComponent({
                    placeholderLabel: "",
                    onSearch: query => {
                        expect(query).toBe(searchQuery);
                        done();
                    }
                }, target);
                const input = document.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
                input.value = searchQuery;
                TestUtils.Simulate.keyUp(input);
                const button = document.querySelector(".sdl-dita-delivery-searchbar .search-button") as HTMLInputElement;
                TestUtils.Simulate.click(button);
            });

        });
    }

    private _renderComponent(props: ISearchBarProps, target: HTMLElement): void {
        ReactDOM.render(<SearchBar {...props} />, target);
    }
}

new SearchBarComponent().runTests();
