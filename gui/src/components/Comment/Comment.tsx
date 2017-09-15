import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IComment } from "interfaces/ServerModels";
import { unescape } from "lodash";

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
     * Comment replies
     *
     * @type {IComment[]}
     * @memberOf ICommentProps
     */
    replies: IComment[];
    /**
     * If comment can have replies
     *
     * @type {boolean}
     * @memberOf ICommentProps
     */
    noReplies?: boolean;
}

export interface ICommentState {
    /**
     * If replies are shown
     *
     * @type {boolean}
     * @memberOf ICommentState
     */
    showReplies: boolean;
}

export class Comment extends React.Component<ICommentProps, ICommentState> {
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

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
        let { userName, creationDate, content, replies, noReplies } = this.props;
        const { formatMessage } = this.context.services.localizationService;
        const { showReplies } = this.state;

        const repliesCount = (replies && replies.length) || 0;

        return (
            <div className="sdl-dita-delivery-comment">
                <div className="sdl-dita-delivery-comment-username">{userName}</div>
                <div className="sdl-dita-delivery-comment-date">{creationDate}</div>
                <div className="sdl-dita-delivery-comment-content">{content}</div>
                {!noReplies && (
                    <div className="sdl-dita-delivery-comment-replies">
                        <button className="sdl-button graphene reply-comment"
                            onClick={() => console.log("Reply dialog open")}>
                            {formatMessage("component.post.comment.reply")}
                        </button>
                        {repliesCount > 0 && (
                            <button
                                className="sdl-button graphene show-replies"
                                onClick={() => {
                                    this.setState({ showReplies: !showReplies });
                                }}>
                                {formatMessage("components.commentslist.comments", [repliesCount.toString()])}
                            </button>
                        )}
                        {showReplies && (
                            <div className="replies">
                                {replies.map((reply, index) => {
                                    return (
                                        <Comment
                                            key={reply.id}
                                            content={unescape(reply.content)}
                                            creationDate={creationDate /*calcCreationDate(reply.creationDate) */}
                                            userName={unescape(reply.user.name)}
                                            replies={[]}
                                            noReplies={true}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
