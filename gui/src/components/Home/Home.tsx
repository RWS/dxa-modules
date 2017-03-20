import { connect } from "react-redux";
import { HomePresentation } from "./HomePresentation";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";
import { getCurrentPub } from "store/reducers/Reducer";

const mapStateToProps = (state: IState): {} => ({
    direction: localization.getDirection(state.language),
    publicationId: getCurrentPub(state).publicationId
});

export const Home = connect(mapStateToProps)(HomePresentation);
