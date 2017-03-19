import { Page as PagePresentation, IPageProps } from "./PagePresentation";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => ({
        direction: localization.getDirection(state.language)
});

export const Page = connect(mapStateToProps)(PagePresentation);
