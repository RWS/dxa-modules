import { PublicationContent as PublicationContentX, IPublicationContentProps, IPublicationContentPropsParams } from "./PublicationContentX";
import { connect } from "react-redux";
import { IPublicationState, IState } from "store/interfaces/State";
import { setPublication } from "store/actions/Actions";

const mapStateToProps = (state: IState) => ({
    id: state.publication.id,
    pageId: state.publication.pageId
});

const mapDispatchToProps = {
    onPulicationChange: setPublication
};

export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentX);
export { IPublicationState, IPublicationContentProps, IPublicationContentPropsParams };