import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { PostCommentPresentation, IPostCommentPresentationProps, IPostCommentPresentationDispatchProps} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getCommentErrorMessage } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const { pageId } = getCurrentPub(state);
    const error = getCommentErrorMessage(state, pageId);

    return { error };
};

export const PostComment = connect(
    mapStateToProps
)(PostCommentPresentation);
