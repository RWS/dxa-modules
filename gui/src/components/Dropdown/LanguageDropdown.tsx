import { connect } from "react-redux";
import { Dropdown, IDropdownValue } from "./Dropdown";
import { changeLanguage } from "store/actions/Actions";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";

const languages: Array<IDropdownValue> = localization.getLanguages().map(language => ({"text": language.name, "value": language.iso}));

const mapStateToProps = (state: IState): {} => ({
    selected: {
        value: state.language,
        text: localization.getLanguageNameByIso(state.language)
    },
    items: languages
});

const mapDispatchToProps = {
    onChange: changeLanguage
};

export const LanguageDropdown = connect(mapStateToProps, mapDispatchToProps)(Dropdown);