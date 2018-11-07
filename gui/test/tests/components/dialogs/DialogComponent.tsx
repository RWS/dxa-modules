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
import { TestBase } from "@sdl/models";
import Dialog, { IRequestHandler } from "components/presentation/Dialog/Dialog";

class DialogComponent extends TestBase {
    public runTests(): void {
        describe("<Dialog />", (): void => {
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

            it("Click outside of Dialog should trigger onRequestClose", (): void => {
                const onRequestCloseSpy = jasmine.createSpy("onRequestClose");
                const component = this._renderComponent(target, onRequestCloseSpy, true);
                TestUtils.Simulate.click(ReactDOM.findDOMNode(component));
                expect(onRequestCloseSpy).toHaveBeenCalled();
            });

            it("triggers onRequestClose when ESC button is clicked", (): void => {
                const onRequestCloseSpy = jasmine.createSpy("onRequestClose");
                this._renderComponent(target, onRequestCloseSpy, true);

                // Workaround to dispatch Esc keyup event.
                var event = document.createEvent("Event");
                event.initEvent("keyup", true, false);
                Object.defineProperty(event, "keyCode", { value: 27 });
                window.dispatchEvent(event);

                expect(onRequestCloseSpy).toHaveBeenCalled();
            });
        });
    }

    private _renderComponent(
        target: HTMLElement,
        onRequestClose: IRequestHandler = () => {},
        open: boolean = true
    ): Dialog {
        const comp = ReactDOM.render(<Dialog open={open} onRequestClose={onRequestClose} />, target) as React.Component<
            {},
            {}
        >;
        return TestUtils.findRenderedComponentWithType(comp, Dialog);
    }
}

new DialogComponent().runTests();
