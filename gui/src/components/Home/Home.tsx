import { connect } from "react-redux";
import { Home as HomePresentation } from "./HomePresentation";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState): {} => ({
    direction: localization.getDirection(state.language)
});

export const Home = connect(mapStateToProps)(HomePresentation);
