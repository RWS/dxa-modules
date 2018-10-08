import * as Moment from "moment";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";
import { IDatePickerProps, DatePickerPresentation } from "./DatePickerPresentation";

const mapStateToProps = (state: IState, ownProps: IDatePickerProps): {} => {
    // Set minimum weekdays name (2 char length) to its short value (3 char length) for current locale
    Moment.locale(state.language);
    Moment.updateLocale(state.language, {
        weekdaysMin: Moment.weekdaysShort()
    });
    return {
        locale: state.language,
        direction: localization.getDirection(state.language),
        ...ownProps
    };
};

/**
 * Connector of DatePicker component for Redux
 *
 * @export
 */
export const DatePicker = connect(mapStateToProps)(DatePickerPresentation);