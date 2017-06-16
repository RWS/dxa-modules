import * as React from "react";
import * as Moment from "moment";
import DatePickerComponent from "react-datepicker";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";

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
}

/**
 * DatePicker state
 *
 * @export
 * @interface IDatePickerState
 */
export interface IDatePickerState {
    startDate: Moment.Moment;
}

export class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {

    /**
     * Creates an instance of DatePicker
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
                locale={this.props.locale}
            />
        );
    }

    private handleChange(date: Moment.Moment): void {
        this.setState({
            startDate: date
        });
    }
}

const mapStateToProps = (state: IState): {} => {
    // Set minimum weekdays name (2 char length) to its short value (3 char length) for current locale
    Moment.locale(state.language);
    Moment.updateLocale(state.language, {
        weekdaysMin: Moment.weekdaysShort()
    });
    return {
        locale: state.language
    };
};

/**
 * Connector of DatePicker component for Redux
 *
 * @export
 */
export const LanguageDatePicker = connect(mapStateToProps)(DatePicker);