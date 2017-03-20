import { PublicationsListPresentation } from "./PublicationsListPresentation";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { getPubsByLang } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const publications = getPubsByLang(state, state.language);
    return { publications };
};

export const PublicationsList = connect(mapStateToProps)(PublicationsListPresentation);
