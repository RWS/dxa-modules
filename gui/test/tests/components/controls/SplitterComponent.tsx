import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { SplitterPresentation, ISplitterProps } from "@sdl/dd/Splitter/SplitterPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class SplitterComponent extends TestBase {
    public runTests(): void {
        describe(`Splitter component tests.`, (): void => {
            const target = super.createTargetElement();
            const defaultProps: ISplitterProps = {
                splitterPosition: 100,
                isLtr: true
            };

            // Workaround for Mouse event in PhantomJS
            const _createMouseEvent = (eventName: string, clientX: number = 0): MouseEvent => {
                const mouseEvent = document.createEvent("MouseEvent");
                mouseEvent.initMouseEvent(
                    eventName, //type
                    true, //canBubble
                    false, //cancelable
                    window, //view
                    1, //detail
                    42, //screenX
                    42, //screenY
                    clientX, //clientX
                    42, //clientY
                    false, //ctrlKey
                    false, //altKey
                    false, //shiftKey
                    false, //metaKey
                    0, //button
                    null //relatedTarget
                );
                return mouseEvent;
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

            it("renders component", (): void => {
                const splitter = this._renderComponent(defaultProps, target);
                const splitterNode = ReactDOM.findDOMNode(splitter);

                expect(splitterNode).toBeDefined();
            });

            // Touch Events are not supported by PhantomJS
            xit("changes position on touch events dragging", (done: () => void): void => {
                const splitter = this._renderComponent(
                    {
                        ...defaultProps,
                        splitterPositionChange: (position: number) => {
                            done();
                        }
                    },
                    target
                );
                const splitterNode = ReactDOM.findDOMNode(splitter);
                TestUtils.Simulate.touchStart(splitterNode);
                TestUtils.Simulate.touchMove(splitterNode);
                TestUtils.Simulate.touchEnd(splitterNode);
            });

            it("changes position on mouse events dragging", (done: () => void): void => {
                const splitter = this._renderComponent(
                    {
                        ...defaultProps,
                        splitterPositionChange: (position: number) => {
                            done();
                        }
                    },
                    target
                );
                const node = ReactDOM.findDOMNode(splitter).querySelector(".sdl-dita-delivery-splitter") as HTMLElement;
                node.dispatchEvent(_createMouseEvent("mousedown"));
                window.dispatchEvent(_createMouseEvent("mousemove", 42));
                window.dispatchEvent(_createMouseEvent("mouseup"));
            });
        });
    }

    private _renderComponent(props: ISplitterProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(
            <ComponentWithContext>
                <SplitterPresentation {...props} />
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new SplitterComponent().runTests();
