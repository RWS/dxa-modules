import { connect } from "react-redux";
import { PublicationsListPresentation } from "./PublicationsListPresentation";
import { getPubsByLang, isPubsLoading } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";

const mapStateToProps = (state: IState) => {
    const publications = getPubsByLang(state, state.language);
    return {
        publications,
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state)
    };
};
/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const PublicationsList = connect(mapStateToProps)(PublicationsListPresentation);
