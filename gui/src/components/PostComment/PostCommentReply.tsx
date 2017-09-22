import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import {
    PostCommentReplyPresentation,
    IPostCommentPresentationProps,
    IPostCommentPresentationDispatchProps
} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, isCommentSaving as isCommentSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const parentId = ownProps.parentId;
    const { pageId, publicationId } = getCurrentPub(state);
    const error = getPostCommentErrorMessage(state, publicationId, pageId, parentId);
    const isCommentSaving = isCommentSavingSelector(state, publicationId, pageId, parentId);

    return { publicationId, pageId, error, isCommentSaving };
};

export const PostCommentReply = connect(mapStateToProps)(PostCommentReplyPresentation);
