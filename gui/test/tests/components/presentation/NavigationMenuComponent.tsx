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
import { NavigationMenu, INavigationMenuProps } from "@sdl/dd/presentation/NavigationMenu";
import { TestBase } from "@sdl/models";

class NavigationMenuComponent extends TestBase {
    public runTests(): void {
        describe(`Navigation Menu tests`, (): void => {
            const target = super.createTargetElement();
            const defaultProps = {
                isOpen: false
            };

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders", (): void => {
                this._renderComponent(defaultProps, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu");
                expect(element).not.toBeNull();
                expect((element as HTMLElement).innerHTML).toBe("<div>Contents</div>");
            });

            it("can open/close", (): void => {
                this._renderComponent(defaultProps, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu") as HTMLElement;
                expect(element.classList).not.toContain("open");
                this._renderComponent({ ...defaultProps, isOpen: true }, target);
                expect(element.classList).toContain("open");
            });
        });
    }

    private _renderComponent(props: INavigationMenuProps, target: HTMLElement): void {
        ReactDOM.render(
            <NavigationMenu {...props}>
                <div>Contents</div>
            </NavigationMenu>,
            target
        );
    }
}

new NavigationMenuComponent().runTests();
