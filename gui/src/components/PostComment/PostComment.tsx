import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { PostCommentPresentation, IPostCommentPresentationProps, IPostCommentPresentationDispatchProps} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, isCommentSaving as isCommentSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const { pageId } = getCurrentPub(state);
    const error = getPostCommentErrorMessage(state, pageId);
    const isCommentSaving = isCommentSavingSelector(state, pageId);

    return { error, pageId, isCommentSaving };
};

export const PostComment = connect(
    mapStateToProps
)(PostCommentPresentation);
