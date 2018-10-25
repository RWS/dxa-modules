import { connect } from "react-redux";
import { ErrorContentPresentation, IErrorContentProps } from "./ErrorContentPresentation";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownProps: IErrorContentProps): {} => ({
    direction: localization.getDirection(state.language)
});

/**
 * Connector of ErrorContent component for Redux
 *
 * @export
 */
export const ErrorContent = connect(mapStateToProps)(ErrorContentPresentation);
