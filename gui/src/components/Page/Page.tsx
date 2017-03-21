import { PagePresentation, IPageProps } from "./PagePresentation";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";
import { getCurrentPub } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => ({
        direction: localization.getDirection(state.language),
        anchor: getCurrentPub(state).anchor
});

export const Page = connect(mapStateToProps)(PagePresentation);
