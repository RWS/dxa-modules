import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { TestBase } from "@sdl/models";
import Dialog, { IRequestHandler } from "components/presentation/Dialog/Dialog";

class TilesListComponent extends TestBase {
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
        });
    }

    private _renderComponent(target: HTMLElement,
        onRequestClose: IRequestHandler = () => { },
        open: boolean = true): Dialog {

        const comp = ReactDOM.render(
            <Dialog open={open} onRequestClose={onRequestClose} />
            , target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, Dialog);
    }
}

new TilesListComponent().runTests();
