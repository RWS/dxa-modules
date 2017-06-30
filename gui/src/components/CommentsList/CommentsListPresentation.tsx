import * as React from "react";
import { Comment } from "@sdl/dd/Comment/Comment";
import { IComment, ICommentDate } from "interfaces/Comments";
import { IAppContext } from "@sdl/dd/container/App/App";

import "@sdl/dd/CommentsList/styles/CommentsList";

export interface ICommentsListProps {
    comments: IComment[];
}

export const CommentsListPresentation: React.StatelessComponent<ICommentsListProps> = (props: ICommentsListProps, context: IAppContext): JSX.Element => {
    const { formatMessage, getLanguage } = context.services.localizationService;
    const comments: IComment[] = props.comments;
    const commentsCount: number = comments.length;

    const calcCreationDate = (dateObject: ICommentDate): string => {
        var options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateObject.year, dateObject.monthValue, dateObject.dayOfMonth).toLocaleString(getLanguage(), options);
        return date;
    };

    return (
        <div className="sdl-dita-delivery-comments-list">
            <span>{formatMessage("components.commentslist.comments")} ({commentsCount})</span>
            {comments.map((comment, index) => {
                return <Comment userName={comment.user.name} creationDate={calcCreationDate(comment.creationDate)} content={comment.content} key={index}/>;
            })}
        </div>
    );
};

CommentsListPresentation.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
