import { PublicationContent as PublicationContentX, IPublicationContentProps } from "./PublicationContentX";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";

const mapStateToProps = (state: IState) => ({
    language: state.language,
    publicationId: state.publication.id,
    pageId: state.publication.pageId
})

export const PublicationContent = connect(mapStateToProps)(PublicationContentX);
export { IState, IPublicationContentProps };
