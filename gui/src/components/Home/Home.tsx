import { connect } from "react-redux";
import { HomePresentation } from "./HomePresentation";
import { IState } from "store/interfaces/State";
import { getCurrentPub, isConditionsDialogVisible } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState): {} => ({
    direction: localization.getDirection(state.language),
    publicationId: getCurrentPub(state).publicationId,
    isConditionsDialogVisible: isConditionsDialogVisible(state)
});

/**
 * Connector of Home component for Redux
 *
 * @export
 */
export const Home = connect(mapStateToProps)(HomePresentation);
