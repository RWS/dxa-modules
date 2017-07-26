import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsSectionsPresentation } from "@sdl/dd/CommentsSection/CommentsSectionPresentation";
import { getCurrentPub, getCommentErrorMessage } from "store/reducers/Reducer";
import { saveComment, fetchComments } from "store/actions/Api";

const mapStateToProps = (state: IState) => {
    const { pageId, publicationId } = getCurrentPub(state);
    const error = getCommentErrorMessage(state, publicationId, pageId);

    return { pageId, publicationId, error };
};

const mapDispatchToState = {
    saveComment,
    fetchComments
};

export const CommentsSection = connect(
    mapStateToProps, mapDispatchToState
)(CommentsSectionsPresentation);
