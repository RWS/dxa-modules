import * as React from "react";
import * as Moment from "moment";
import DatePickerComponent from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export interface IDatePickerWrapperState {
    startDate: Moment.Moment;
}

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
            />
        );
    }

    private handleChange(date: Moment.Moment): void {
        this.setState({
            startDate: date
        });
    }
}
