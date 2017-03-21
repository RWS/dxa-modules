import { connect } from "react-redux";
import { PublicationsListPresentation } from "./PublicationsListPresentation";
import { getPubsByLang } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";

const mapStateToProps = (state: IState) => {
    const publications = getPubsByLang(state, state.language);
    return { publications };
};

/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const PublicationsList = connect(mapStateToProps)(PublicationsListPresentation);
