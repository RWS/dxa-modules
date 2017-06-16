import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Moment from "moment";
import * as TestUtils from "react-addons-test-utils";
import { DatePicker } from "@sdl/dd/DatePicker/DatePicker";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class DatePickerComponent extends TestBase {

    public runTests(): void {

        describe(`Dropdown component tests.`, (): void => {
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

            it("Correct component render", (): void => {
                const datepicker = this._renderComponent({}, target);
                const datePickerСomponent = TestUtils.findRenderedComponentWithType(datepicker, DatePicker);
                expect(datePickerСomponent).not.toBeNull();
            });

            it("Correct component initial state", (): void => {
                const datepicker = this._renderComponent({}, target);
                const datepickerNode = ReactDOM.findDOMNode(datepicker);
                const datepickerInput = datepickerNode.querySelector("input") as HTMLInputElement;
                const currentDate = new Date();
                const moment = Moment(currentDate);
                expect(datepickerInput.value).toBe(moment.format("MM/DD/YYYY"));
            });

            it("Toggle component", (): void => {
                const datepicker = this._renderComponent({}, target);
                const datepickerNode = ReactDOM.findDOMNode(datepicker);
                const datepickerInput = datepickerNode.querySelector("input") as HTMLInputElement;
                TestUtils.Simulate.click(datepickerInput);
                const datepickerCalendar = document.querySelectorAll(".react-datepicker");
                expect(datepickerCalendar.length).toBe(1);
                expect(datepickerCalendar[0]).not.toBeNull();
            });
        });
    }

    private _renderComponent(props: {}, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><DatePicker {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new DatePickerComponent().runTests();
