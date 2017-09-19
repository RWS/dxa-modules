import * as React from "react";
// import * as PropTypes from "prop-types";
// import { IAppContext } from "@sdl/dd/container/App/App";
// import { IComment } from "interfaces/ServerModels";
// import { unescape } from "lodash";
// import { PostCommentReply } from "@sdl/dd/PostComment/PostComment";

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
    // /**
    //  * Comment replies
    //  *
    //  * @type {IComment[]}
    //  * @memberOf ICommentProps
    //  */
    // replies: IComment[];
    // /**
    //  * If comment can have replies
    //  *
    //  * @type {boolean}
    //  * @memberOf ICommentProps
    //  */
    // noReplies?: boolean;
}

 export interface ICommentState {
//     /**
//      * If replies are shown
//      *
//      * @type {boolean}
//      * @memberOf ICommentState
//      */
//     showReplies: boolean;
//     /**
//      * If post reply dialog is shown
//      *
//      * @type {boolean}
//      * @memberOf ICommentState
//      */
//     showPostReply: boolean;
 }

export class Comment extends React.Component<ICommentProps, ICommentState> {
    // public static contextTypes: React.ValidationMap<IAppContext> = {
    //     services: PropTypes.object.isRequired
    // };

    /**
     * Global context
     *
     * @type {IAppContext}
     */
    // public context: IAppContext;

    constructor() {
        super();
        // this.state = {
        //     showReplies: false,
        //     showPostReply: false
        // };
    }

    public render(): JSX.Element {
        let { userName, creationDate, content, /*replies, noReplies,*/ children } = this.props;
        //const { formatMessage } = this.context.services.localizationService;
        //const { showReplies, showPostReply } = this.state;

        //const repliesCount = (replies && replies.length) || 0;

        return (
            <div className="sdl-dita-delivery-comment">
                <div className="sdl-dita-delivery-comment-username">{userName}</div>
                <div className="sdl-dita-delivery-comment-date">{creationDate}</div>
                <div className="sdl-dita-delivery-comment-content">{content}</div>
                {children}
                {
                /*
                !noReplies && (
                    <div className="sdl-dita-delivery-comment-replies">
                        <button
                            className="sdl-button graphene sdl-button-purpose-ghost reply-comment"
                            onClick={() => {
                                this.setState({ showPostReply: !showPostReply });
                            }}
                        >
                            {formatMessage("component.post.comment.reply")}
                        </button>
                        {repliesCount > 0 && (
                            <button
                                className="sdl-button graphene sdl-button-purpose-ghost show-replies"
                                onClick={() => {
                                    this.setState({ showReplies: !showReplies });
                                }}
                            >
                                {formatMessage("components.commentslist.comments", [repliesCount.toString()])}
                            </button>
                        )}
                        {showPostReply && (
                            <PostCommentReply
                                handleSubmit={() => {

                                }}
                                handleReset={() => {
                                    this.setState({ showPostReply: false });
                                }}
                            />
                        )}
                        {showReplies && (
                            <div className="replies">
                                {replies.map((reply, index) => {
                                    return (
                                        <Comment
                                            key={reply.id}
                                            content={unescape(reply.content)}
                                            creationDate={calcCreationDate(reply.creationDate)}
                                            userName={unescape(reply.user.name)}
                                            replies={[]}
                                            noReplies={true}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )
            */}
            </div>
        );
    }
}
