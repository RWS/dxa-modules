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

export class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {

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
            <DatePickerComponent
                selected={this.state.selectedDate || (this.props.value ? Moment(this.props.value, "YYYYMMDD") : undefined)}
                onChange={this.handleChange}
                calendarClassName="sdl-dita-delivery-datepicker"
                className="sdl-input-text"
                locale={this.props.locale}
            />
        );
    }

    private handleChange(date: Moment.Moment): void {
        this.setState({
            selectedDate: date
        }, (this.props.onChangeHandler) ? this.props.onChangeHandler(date) : undefined);
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