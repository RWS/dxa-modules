/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
