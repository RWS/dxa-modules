import { PublicationContent as PublicationContentX } from "./PublicationContentX";
import { connect } from "react-redux";
import { IPublicationState } from "store/interfaces/State";

const mapStateToProps = (state: IPublicationState) => ({
    publicationId: state.id,
    pageId: state.pageId
});

export const PublicationContent = connect(mapStateToProps)(PublicationContentX);