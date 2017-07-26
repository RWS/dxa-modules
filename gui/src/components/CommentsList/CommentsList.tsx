import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getComments } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { pageId, publicationId } = getCurrentPub(state);
    const comments = getComments(state, publicationId, pageId);

    return { comments };
};

export const CommentsList = connect(
    mapStateToProps
)(CommentsListPresentation);
