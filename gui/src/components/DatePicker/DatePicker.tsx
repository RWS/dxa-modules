import * as React from "react";
import * as Moment from "moment";
import DatePickerComponent from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "components/DatePicker/DatePicker.less";

export interface IDatePickerWrapperState {
    startDate: Moment.Moment;
}

// Set minimum weekdays name (2 char length) to its short value (3 char length) for current locale
Moment.updateLocale(Moment.locale(), {
    weekdaysMin: Moment.weekdaysShort()
});

export class DatePicker extends React.Component<{}, IDatePickerWrapperState> {

    /**
     * Creates an instance of Dropdown
     *
     */
    constructor() {
        super();
        this.state = {
            startDate: Moment()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <DatePickerComponent
                selected={this.state.startDate}
                onChange={this.handleChange}
                calendarClassName="sdl-dita-delivery-datepicker"
            />
        );
    }

    private handleChange(date: Moment.Moment): void {
        this.setState({
            startDate: date
        });
    }

}
