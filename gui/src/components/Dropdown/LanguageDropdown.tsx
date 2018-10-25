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