import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Moment from "moment";
import * as TestUtils from "react-addons-test-utils";
import { DatePickerPresentation } from "@sdl/dd/DatePicker/DatePickerPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { LocalizationService } from "test/mocks/services/LocalizationService";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";

const services = {
    localizationService: new LocalizationService()
};

class DatePickerComponent extends TestBase {

    public runTests(): void {

        describe(`DatePicker component tests.`, (): void => {
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
                const datepicker = this._renderComponent(target, "20171212");
                const datePickerСomponent = TestUtils.findRenderedComponentWithType(datepicker, DatePickerPresentation);
                expect(datePickerСomponent).not.toBeNull();
            });

            it("Correct component initial state", (): void => {
                const datepicker = this._renderComponent(target, "20171212");
                const datepickerNode = ReactDOM.findDOMNode(datepicker);
                const datepickerInput = datepickerNode.querySelector("input") as HTMLInputElement;
                const currentDate = new Date("2017-12-12T00:00:00Z");
                const moment = Moment(currentDate);
                expect(datepickerInput.value).toBe(moment.format("MM/DD/YYYY"));
            });

            it("Toggle component", (): void => {
                const datepicker = this._renderComponent(target, "20171212");
                const datepickerNode = ReactDOM.findDOMNode(datepicker);
                const datepickerInput = datepickerNode.querySelector("input") as HTMLInputElement;
                TestUtils.Simulate.click(datepickerInput);
                const datepickerCalendar = document.querySelectorAll(".react-datepicker");
                expect(datepickerCalendar.length).toBe(1);
                expect(datepickerCalendar[0]).not.toBeNull();
            });
        });
    }

    private _renderComponent(target: HTMLElement, value: string): DatePickerPresentation {
        const store = configureStore({});
        const comp = ReactDOM.render(
            (
                <Provider store={store}>
                    <ComponentWithContext {...services}>
                        <DatePickerPresentation value={value} />
                    </ComponentWithContext>
                </Provider>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, DatePickerPresentation) as DatePickerPresentation;
    }
}

new DatePickerComponent().runTests();
