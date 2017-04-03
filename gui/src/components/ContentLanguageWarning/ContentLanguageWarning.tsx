import { IState } from "store/interfaces/State";
import { ContentLanguageWarningPresentation } from "./ContentLanguageWarningPresentation";
import { connect } from "react-redux";
import { getCurrentPub, getPubById, getPubByIdAndLang, getPageById } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const currentPublication = getCurrentPub(state);
    const { publicationId, pageId } = currentPublication;
    const publication = getPubById(state, publicationId);
    const contentLanguage = publication.language || state.language;
    const match = state.language === contentLanguage;
    const languagePublication = getPubByIdAndLang(state, publicationId, state.language);
    const languagePage = getPageById(state, pageId);

    return {
        contentLanguage,
        uiLanguage: state.language,
        match,
        languagePublication,
        languagePage
    };
};

/**
 * Connector of Content Language Warining for Redux
 *
 * @export
 */
export const ContentLanguageWarning = connect(mapStateToProps)(ContentLanguageWarningPresentation);