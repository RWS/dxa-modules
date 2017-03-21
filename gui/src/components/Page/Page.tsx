import { connect } from "react-redux";
import { PagePresentation, IPageProps } from "./PagePresentation";
import { IState } from "store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => ({
    direction: localization.getDirection(state.language),
    anchor: getCurrentPub(state).anchor
});

/**
 * Connector of Page component for Redux
 *
 * @export
 */
export const Page = connect(mapStateToProps)(PagePresentation);
