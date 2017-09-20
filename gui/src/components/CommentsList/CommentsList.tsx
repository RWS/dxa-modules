import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getComments, getCommentErrorMessage } from "store/reducers/Reducer";
import { saveReply, fetchComments } from "store/actions/Api";

const mapStateToProps = (state: IState) => {
    const { pageId, publicationId } = getCurrentPub(state);
    const comments = getComments(state, publicationId, pageId);
    const error = getCommentErrorMessage(state, publicationId, pageId);

    return { pageId, publicationId, comments, error };
};

const mapDispatchToState = {
    saveReply,
    fetchComments
};

export const CommentsList = connect(mapStateToProps, mapDispatchToState)(CommentsListPresentation);
