import { connect } from "react-redux";
import { HomePresentation, IHomeProps } from "./HomePresentation";
import { IState } from "store/interfaces/State";
import { isConditionsDialogVisible } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownProps: IHomeProps): {} => ({
    direction: localization.getDirection(state.language),
    publicationId: ownProps.params.publicationId,
    isConditionsDialogVisible: isConditionsDialogVisible(state)
});

/**
 * Connector of Home component for Redux
 *
 * @export
 */
export const Home = connect(mapStateToProps)(HomePresentation);
