import { PublicationContentPresentation } from "./PublicationContentPresentation";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { getCurrentPub, getPubById, getPageById, getPageError } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId } = getCurrentPub(state);
    const publication = getPubById(state, publicationId);
    const page = getPageById(state, pageId);
    const pageError = getPageError(state, pageId);
    return { publicationId, pageId, publication, page, pageError };
};

const mapDispatchToProps = {
    onPulicationChange: publicationRouteChanged
};

export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentPresentation);