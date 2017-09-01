import * as React from "react";
import I18n from "@sdl/dd/helpers/I18n";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IComment } from "interfaces/ServerModels";
import "components/comment/styles/Comment";

// import { connect } from "react-redux";
// import { CommentPresentation, ICommentProps } from "@sdl/dd/Comment/CommentPresentation";
/*
const mapCommentProps = (commentProps: ICommentProps) => {
    return commentProps;
};

export const Comment = connect(mapCommentProps)(CommentPresentation);
*/

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
    replies: IComment[];
}

export interface ICommentState {
    showReplies: boolean;
}

export class Comment extends React.Component<ICommentProps, ICommentState> {

    /**
     * Global context
     *
     * @type {IAppContext}
     */
    public context: IAppContext;

    constructor() {
        super();
        this.state = {
            showReplies: false
        };
    }

    public render(): JSX.Element {
        let {userName, creationDate, content, replies} = this.props;
        const { formatMessage } = this.context.services.localizationService;
        const { showReplies } = this.state;

        return (
            <div className="sdl-dita-delivery-comment">
                <div className="sdl-dita-delivery-comment-username">{userName}</div>
                <div className="sdl-dita-delivery-comment-date">{creationDate}</div>
                <div className="sdl-dita-delivery-comment-content">{content}</div>
                <div className="sdl-dita-delivery-comment-reply-showreplies-block">
                    <div className="sdl-dita-delivery-comment-reply-button" onClick={() => alert("asdf")}>
                        <div className="reply-icon" />
                        <div className="reply-label"><I18n data="component.post.comment.reply"/></div>
                    </div>
                    {replies.length > 0 ?
                        <div className="sdl-dita-delivery-comment-show-replies" onClick={() => { this.setState({showReplies: !showReplies}); }}>
                        <div className="show-replies-icon"/>
                        <div className="show-replies-label"><I18n data={formatMessage("components.commentslist.comments", [replies.length.toString()])} /></div>
                    </div>
                    : null}
                    {showReplies
                    ?
                        <div>showReplies</div>
                    :
                        <div>No replies</div>
                    }
                </div>
            </div>
        );
    };
}
