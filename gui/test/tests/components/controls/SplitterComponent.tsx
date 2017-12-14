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

            xit("changes position on mouse events dragging", (done: () => void): void => {
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
                TestUtils.Simulate.mouseDown(splitterNode);
                TestUtils.Simulate.mouseMove(splitterNode);
                TestUtils.Simulate.mouseUp(splitterNode);
            });

            it("changes position on resize", (done: () => void): void => {
                const splitter = this._renderComponent(
                    {
                        ...defaultProps,
                        splitterPositionChange: (position: number) => {
                            expect(position).toBe(0);
                            done();
                        }
                    },
                    target
                );
                const splitterNode = ReactDOM.findDOMNode(splitter) as HTMLElement;
                splitterNode.style.display = "none";
                window.dispatchEvent(new Event("resize"));
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
