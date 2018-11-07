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

import { connect } from "react-redux";
import { Dropdown } from "./Dropdown";
import { changeLanguage } from "store/actions/Actions";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";
import { getPubList } from "store/reducers/Reducer";
import { union } from "lodash";

const knownLanguages = localization.getLanguages().map(language => language.iso);

const toDropdownFormat = (language: string) => ({"text": localization.isoToName(language), "value": language, "direction": localization.getDirection(language)});

const mapStateToProps = (state: IState): {} => {
    const pubsLanguages = getPubList(state)
        .filter(pub => pub.language)
        .map(pub => pub.language)
        .sort();

    return {
        selected: toDropdownFormat(state.language),
        items: union(knownLanguages, pubsLanguages).map(toDropdownFormat)
    };
};

const mapDispatchToProps = {
    onChange: changeLanguage
};

/**
 * Connector of Language Dropdown component for Redux
 *
 * @export
 */
export const LanguageDropdown = connect(mapStateToProps, mapDispatchToProps)(Dropdown);
