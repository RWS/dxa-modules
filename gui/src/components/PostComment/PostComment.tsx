import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import {
    PostCommentPresentation,
    IPostCommentPresentationProps,
    IPostCommentPresentationDispatchProps
} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentLocation, getPubById, getPageById } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, commentIsSaving as commentIsSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const { pageId, publicationId } = getCurrentLocation(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const { title: pageTitle } = getPageById(state, publicationId, pageId);

    const error = getPostCommentErrorMessage(state, publicationId, pageId);
    const commentIsSaving = commentIsSavingSelector(state, publicationId, pageId);

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

export const PostComment = connect(mapStateToProps)(PostCommentPresentation);
