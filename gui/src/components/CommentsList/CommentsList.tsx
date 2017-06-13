import * as React from "react";
import { Comment } from "@sdl/dd/Comment/Comment";
import "components/CommentsList/styles/CommentsList";

export interface ICommentsListProps {
}

export const CommentsList: React.StatelessComponent<ICommentsListProps> = (props: ICommentsListProps): JSX.Element => {

    let commentContent = `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Aliquam ac aliquam ipsum.
            Donec sed nisi imperdiet, dictum felis eu, gravida nisi.`;

    return (
        <div className="sdl-dita-delivery-comments-list">
            <span>Comments (17)</span>
            <Comment userName="Mark White" creationDate="4 November, 2016" content={commentContent} />
            <Comment userName="Steve Crawford" creationDate="4 November, 2016" content={commentContent} />
            <Comment userName="John Smith" creationDate="4 November, 2016" content={commentContent} />
        </div>
    );
};
