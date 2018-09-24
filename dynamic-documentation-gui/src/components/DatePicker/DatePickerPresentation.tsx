import * as React from "react";
import * as Moment from "moment";
import DatePickerComponent from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "components/DatePicker/DatePicker.less";

/**
 * DatePicker interface
 *
 * @export
 * @interface IDatePickerProps
 */
export interface IDatePickerProps {
    /**
     * Locale
     * @type {string}
     */
    locale?: string;
    /**
     * Content direction
     *
     * @type {("ltr" | "rtl")}
     * @memberOf IErrorContentProps
     */
    direction?: "ltr" | "rtl";
    /**
     * Default value
     * @type {string}
     */
    value?: string;
    /**
     * Change handler
     */
    onChangeHandler?: (value: Moment.Moment) => undefined;
}

/**
 * DatePicker state
 *
 * @export
 * @interface IDatePickerState
 */
export interface IDatePickerState {
    selectedDate?: Moment.Moment;
}

export class DatePickerPresentation extends React.Component<IDatePickerProps, IDatePickerState> {

    /**
     * Creates an instance of DatePicker
     */
    constructor() {
        super();
        this.state = {
            selectedDate: undefined
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
            <div>
                <DatePickerComponent
                    selected={this.state.selectedDate || (this.props.value ? Moment(this.props.value, "YYYYMMDD") : undefined)}
                    onChange={this.handleChange}
                    calendarClassName="sdl-dita-delivery-datepicker"
                    className="sdl-input-text"
                    locale={this.props.locale}
                    popoverAttachment={"top " + (this.props.direction === "rtl" ? "right" : "left")}
                    popoverTargetAttachment={"bottom " + (this.props.direction === "rtl" ? "right" : "left")}
                />
                <input type="date" className="sdl-input-text sdl-input-datepicker" />
            </div>
        );
    }

    private handleChange(date: Moment.Moment): void {
        this.setState({
            selectedDate: date
        }, (this.props.onChangeHandler) ? this.props.onChangeHandler(date) : undefined);
    }
}