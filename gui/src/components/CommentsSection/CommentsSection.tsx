import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsSectionsPresentation } from "@sdl/dd/CommentsSection/CommentsSectionPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { saveComment } from "store/actions/Api";

const mapStateToProps = (state: IState) => {
    const { pageId, publicationId } = getCurrentPub(state);
    return { pageId, publicationId };
};

const mapDispatchToState = {
    saveComment
};

export const CommentsSection = connect(
    mapStateToProps, mapDispatchToState
)(CommentsSectionsPresentation);
