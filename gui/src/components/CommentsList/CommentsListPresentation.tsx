import * as React from "react";
import * as PropTypes from "prop-types";
import { Comment } from "@sdl/dd/Comment/Comment";
import { IComment, ICommentDate } from "interfaces/ServerModels";
import { IAppContext } from "@sdl/dd/container/App/App";
import { PostCommentReply } from "@sdl/dd/PostComment/PostComment";
import { unescape } from "lodash";

import "@sdl/dd/CommentsList/styles/CommentsList";

export interface ICommentsListProps {
    /**
     * Comments list
     *
     * @type {IComment[]}
     * @memberOf ICommentsListProps
     */
    comments: IComment[];
}

export interface ICommentsListState {
    /**
     * If number of shown comments
     *
     * @type {number}
     * @memberOf ICommentsListState
     */
    showComments: number;

    /**
     * If comment replies are shown
     *
     * @type {number[]}
     * @memberOf ICommentsListState
     */
    showCommentReplies: { [key: number]: boolean };

    /**
     * If comment reply section is shown
     *
     * @type {boolean}
     * @memberOf number[]
     */
    showCommentPostReply: { [key: number]: boolean };
}

const DEFAULT_AMOUNT: number = 5;
const INCREMENT: number = 10;
const DATE_OPTIONS = { year: "numeric", month: "long", day: "numeric" };

export class CommentsListPresentation extends React.Component<ICommentsListProps, ICommentsListState> {
    /**
     * Context types
     *
     * @static
     * @type {React.ValidationMap<IAppContext>}
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    /**
     * Global context
     *
     * @type {IAppContext}
     */
    public context: IAppContext;

    public static calcCreationDate = (dateObject: ICommentDate, language: string): string => {
        const date = new Date(dateObject.year, dateObject.monthValue - 1, dateObject.dayOfMonth).toLocaleString(language, DATE_OPTIONS);
        return date;
    };

    constructor() {
        super();
        this.state = {
            showComments: DEFAULT_AMOUNT,
            showCommentReplies: [],
            showCommentPostReply: []
        };

        this.showMoreComments = this.showMoreComments.bind(this);
    }

    public render(): JSX.Element {
        const { formatMessage, getLanguage } = this.context.services.localizationService;
        const { comments } = this.props;
        let { showComments } = this.state;

        const displayedComments = comments.slice(0, showComments);
        const totalCommentsCount: number = comments.length;
        const displayedCommentsCount: number = displayedComments.length;
        const language = getLanguage();

        return (
            <div className="sdl-dita-delivery-comments-list">
                {totalCommentsCount > 0 && <span>{formatMessage("components.commentslist.comments", [totalCommentsCount.toString()])}</span>}
                {displayedComments.map((comment, index) => {
                    return (
                        <Comment
                            key={comment.id}
                            content={unescape(comment.content)}
                            creationDate={CommentsListPresentation.calcCreationDate(comment.creationDate, language)}
                            userName={unescape(comment.user.name)}
                        >
                            {this._renderCommentReplies(comment.id, comment.children)}
                        </Comment>
                    );
                })}
                {totalCommentsCount > displayedCommentsCount && (
                    <div className="sdl-dita-delivery-comments-list-more">
                        <button className="sdl-button graphene sdl-button-purpose-ghost" onClick={this.showMoreComments}>
                            {formatMessage("component.comments.list.more")}
                        </button>
                        <div>{formatMessage("component.comments.list.amount", [displayedCommentsCount.toString(), totalCommentsCount.toString()])}</div>
                    </div>
                )}
            </div>
        );
    }

    private showMoreComments(): void {
        this.setState((prevState: ICommentsListState, props: ICommentsListProps) => {
            return { showComments: prevState.showComments + INCREMENT };
        });
    }

    private _renderCommentReplies(id: number, replies: IComment[]): JSX.Element {
        const { formatMessage, getLanguage } = this.context.services.localizationService;
        const { showCommentReplies, showCommentPostReply } = this.state;

        const language = getLanguage();
        const repliesCount = (replies && replies.length) || 0;

        return (
            <div className="sdl-dita-delivery-comment-replies">
                <button
                    className="sdl-button graphene sdl-button-purpose-ghost reply-comment"
                    onClick={() => {
                        showCommentPostReply[id] = !showCommentPostReply[id];
                        this.setState({ showCommentPostReply });
                    }}
                >
                    {formatMessage("component.post.comment.reply")}
                </button>
                {repliesCount > 0 && (
                    <button
                        className="sdl-button graphene sdl-button-purpose-ghost show-replies"
                        onClick={() => {
                            showCommentReplies[id] = !showCommentReplies[id];
                            this.setState({ showCommentReplies });
                        }}
                    >
                        {formatMessage("components.commentslist.comments", [repliesCount.toString()])}
                    </button>
                )}
                {showCommentPostReply[id] && (
                    <PostCommentReply
                        handleSubmit={() => {}}
                        handleReset={() => {
                            showCommentPostReply[id] = false;
                            this.setState({ showCommentPostReply });
                        }}
                    />
                )}
                {showCommentReplies[id] && (
                    <div className="replies">
                        {replies.map((reply, index) => {
                            return (
                                <Comment
                                    key={reply.id}
                                    content={unescape(reply.content)}
                                    creationDate={CommentsListPresentation.calcCreationDate(reply.creationDate, language)}
                                    userName={unescape(reply.user.name)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}
