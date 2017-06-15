import * as React from "react";
import { Comment } from "@sdl/dd/Comment/Comment";
import { IComment } from "interfaces/Comments";
import { IAppContext } from "@sdl/dd/container/App/App";

import "@sdl/dd/CommentsList/styles/CommentsList";

export interface ICommentsListProps {
    comments: IComment[];
}

export const CommentsListPresentation: React.StatelessComponent<ICommentsListProps> = (props: ICommentsListProps, context: IAppContext): JSX.Element => {
    const { formatMessage } = context.services.localizationService;
    const comments: IComment[] = props.comments;
    let commentsCount: number = comments.length;

    return (
        <div className="sdl-dita-delivery-comments-list">
            <span>{formatMessage("components.commentslist.comments")} ({commentsCount})</span>
            {comments.map(comment => {
                return <Comment userName={comment.user.name} creationDate={comment.creationDate} content={comment.content} />;
            })}
        </div>
    );
};

CommentsListPresentation.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
