import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { getCurrentPub } from "store/reducers/Reducer";
import { getComments } from "store/reducers/Reducer";
import { saveReply } from "store/actions/Api";

const mapStateToProps = (state: IState) => {
    const { pageId, publicationId } = getCurrentPub(state);
    const comments = getComments(state, publicationId, pageId);

    return { comments };
};

const mapDispatchToState = {
    saveReply
};

export const CommentsList = connect(
    mapStateToProps,
    mapDispatchToState
)(CommentsListPresentation);
