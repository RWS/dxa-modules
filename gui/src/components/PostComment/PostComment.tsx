import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import {
    PostCommentPresentation,
    IPostCommentPresentationProps,
    IPostCommentPresentationDispatchProps
} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentPub, getPubById, getPageById } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, isCommentSaving as isCommentSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const { pageId, publicationId } = getCurrentPub(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const { title: pageTitle } = getPageById(state, publicationId, pageId);

    const error = getPostCommentErrorMessage(state, publicationId, pageId);
    const isCommentSaving = isCommentSavingSelector(state, publicationId, pageId);

    return {
        error,
        pageId,
        pageTitle,
        publicationId,
        publicationTitle,
        language: state.language,
        isCommentSaving
    };
};

export const PostComment = connect(mapStateToProps)(PostCommentPresentation);
