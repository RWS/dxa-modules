import { PublicationContent as PublicationContentX, IPublicationContentProps, IPublicationContentPropsParams } from "./PublicationContentX";
import { connect } from "react-redux";
import { IPublicationState, IState } from "store/interfaces/State";

const mapStateToProps = (state: IState) => ({
    id: state.publication.id,
    pageId: state.publication.pageId
});

export const PublicationContent = connect(mapStateToProps)(PublicationContentX);
export { IPublicationState, IPublicationContentProps, IPublicationContentPropsParams };