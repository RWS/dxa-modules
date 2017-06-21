import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getCommentsByPageId } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { pageId } = getCurrentPub(state);
    const comments = getCommentsByPageId(state, pageId);

    return { comments };
};

export const CommentsList = connect(
    mapStateToProps
)(CommentsListPresentation);
