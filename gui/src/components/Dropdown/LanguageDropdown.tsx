import { connect } from "react-redux";
import { Dropdown } from "./Dropdown";
import { changeLanguage } from "store/actions/Actions";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";
import { getPubList } from "store/reducers/Reducer";
import { chain } from "lodash";

const knownLanguages = localization.getLanguages().map(language => language.iso);

const toDropdownFormat = (language: string) => ({"text": localization.isoToName(language), "value": language});

const mapStateToProps = (state: IState): {} => {

    const languages = chain(getPubList(state))
        .filter(pub => pub.language)
        .map(pub => pub.language)
        .union(knownLanguages)
        .map(toDropdownFormat)
        .value();

    return {
        selected: toDropdownFormat(state.language),
        items: languages
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