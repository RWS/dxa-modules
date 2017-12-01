import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import {
    PostCommentReplyPresentation,
    IPostCommentPresentationProps,
    IPostCommentPresentationDispatchProps
} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentPub, getPubById, getPageById } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, commentIsSaving as commentIsSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const parentId = ownProps.parentId;
    const { pageId, publicationId } = getCurrentPub(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const { title: pageTitle } = getPageById(state, publicationId, pageId);
    const error = getPostCommentErrorMessage(state, publicationId, pageId, parentId);
    const commentIsSaving = commentIsSavingSelector(state, publicationId, pageId, parentId);

    return {
        error,
        pageId,
        pageTitle,
        publicationId,
        publicationTitle,
        language: state.language,
        commentIsSaving
    };
};

export const PostCommentReply = connect(mapStateToProps)(PostCommentReplyPresentation);
