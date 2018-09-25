import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { ContentLanguageWarningPresentation } from "@sdl/dd/ContentLanguageWarning/ContentLanguageWarningPresentation";
import { getCurrentLocation, getPubById, getPubForLang } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const currentPublication = getCurrentLocation(state);
    const { publicationId } = currentPublication;
    const publication = getPubById(state, publicationId);
    const contentLanguage = publication.language || state.language;
    const match = state.language === contentLanguage;
    const languagePublication = getPubForLang(state, publication, state.language);

    return {
        contentLanguage,
        uiLanguage: state.language,
        match,
        languagePublication
    };
};

/**
 * Connector of Content Language Warining for Redux
 *
 * @export
 */
export const ContentLanguageWarning = connect(mapStateToProps)(ContentLanguageWarningPresentation);
