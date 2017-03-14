import { PublicationContentPresentation } from "./PublicationContentPresentaion";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { setPublication } from "store/actions/Actions";
import { getCurrentPub, getPubById, getPageById } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId } = getCurrentPub(state);
    const publication = getPubById(state, publicationId);
    const page = getPageById(state, pageId);
    return { publicationId, pageId, publication, page };
};

const mapDispatchToProps = {
    onPulicationChange: setPublication
};

export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentPresentation);