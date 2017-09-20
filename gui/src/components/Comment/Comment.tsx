import * as React from "react";
import "components/Comment/Comment.less";

/**
 * User comment interface
 *
 * @export
 * @interface ICommentProps
 */
export interface ICommentProps {
    /**
     * Commenter name
     *
     * @type {string}
     * @memberOf ICommentProps
     */
    userName: string;
    /**
     * Comment creating date
     *
     * @type {string}
     * @memberOf ICommentProps
     */
    creationDate: string;
    /**
     * Comment content
     *
     * @type {string}
     * @memberOf ICommentProps
     */
    content: string;
    /**
     * Comment content
     *
     * @type {JSX.Element}
     * @memberOf ICommentProps
     */
    children?: JSX.Element;
}

export const Comment: React.StatelessComponent<ICommentProps> = (props: ICommentProps): JSX.Element => {
    let { userName, creationDate, content, children } = props;

    return (
        <div className="sdl-dita-delivery-comment">
            <div className="sdl-dita-delivery-comment-username">{userName}</div>
            <div className="sdl-dita-delivery-comment-date">{creationDate}</div>
            <div className="sdl-dita-delivery-comment-content">{content}</div>
            {children}
        </div>
    );
};
