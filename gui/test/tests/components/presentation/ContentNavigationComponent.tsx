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
import { ContentNavigation, IContentNavigationItem, IContentNavigationProps } from "@sdl/dd/presentation/ContentNavigation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class ContentNavigationComponent extends TestBase {

    public runTests(): void {

        describe(`ContentNavigation component tests.`, (): void => {
            const target = super.createTargetElement();

            const navItems: IContentNavigationItem[] = [{
                id: "title_1",
                url: "/123/456/publication/Title-1",
                indention: 1,
                title: "Title-1"
            }, {
                id: "title_2",
                url: "/123/567/publication/Title-2",
                indention: 2,
                title: "Title-2"
            }];

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders content navigation panel", (): void => {
                this._renderComponent({
                    navItems: navItems
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-content-navigation");
                expect(element).not.toBeNull();
                const hyperlinks = (element as HTMLElement).querySelectorAll("a");
                expect(hyperlinks.length).toBe(2);

                expect(hyperlinks.item(0).textContent).toBe(navItems[0].title);
                expect((hyperlinks.item(0).parentNode as HTMLElement).classList).toContain("indent-1");

                expect(hyperlinks.item(1).textContent).toBe(navItems[1].title);
                expect((hyperlinks.item(1).parentNode as HTMLElement).classList).toContain("indent-2");
            });
        });

    }

    private _renderComponent(props: IContentNavigationProps, target: HTMLElement): void {
        ReactDOM.render(<ComponentWithContext><ContentNavigation {...props} /></ComponentWithContext>, target);
    }
}

new ContentNavigationComponent().runTests();
