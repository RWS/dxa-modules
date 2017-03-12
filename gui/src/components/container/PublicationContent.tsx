import { PublicationContent as PublicationContentX } from "./PublicationContentX";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { setPublication } from "store/actions/Actions";
import { getCurrentPub } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId } = getCurrentPub(state);
    return { publicationId, pageId };
};

const mapDispatchToProps = {
    onPulicationChange: setPublication
};

export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentX);