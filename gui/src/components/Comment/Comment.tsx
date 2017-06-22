import * as React from "react";
import "components/comment/styles/Comment";

/**
 * User comment interface
 *
 * @export
 * @interface ICommentProps
 */
export interface ICommentProps {
    userName: string;
    creationDate: string;
    content: string;
}

/**
 * Component for showing user comment
 *
 * @param {ICommentProps} props
 * @returns {JSX.Element}
 */
export const Comment: React.StatelessComponent<ICommentProps> = (props: ICommentProps): JSX.Element => {
    let {userName, creationDate, content } = props;

    return (
        <div className="sdl-dita-delivery-comment">
            <div className="sdl-dita-delivery-comment-username">{userName}</div>
            <div className="sdl-dita-delivery-comment-date">{creationDate}</div>
            <div className="sdl-dita-delivery-comment-content">{content}</div>
        </div>
    );
};
