import * as React from "react";
import * as PropTypes from "prop-types";
import { Comment } from "@sdl/dd/Comment/Comment";
import { IComment, ICommentDate } from "interfaces/ServerModels";
import { FetchComments, IFetchCommentsProperties } from "@sdl/dd/helpers/FetchComments";
import { IAppContext } from "@sdl/dd/container/App/App";
import { PostCommentReply } from "@sdl/dd/PostComment/PostCommentReply";
import { unescape } from "lodash";
import { IPageService } from "services/interfaces/PageService";
import { IPostComment } from "interfaces/Comments";

import { Error } from "@sdl/dd/presentation/Error";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";

import "@sdl/dd/CommentsList/styles/CommentsList";

export interface ICommentsListProps {
    /**
     *
     * @type {string}
     * @memberof ICommentsSectionProps
     */
    publicationId: string;
    /**
     *
     * @type {string}
     * @memberof ICommentsSectionProps
     */
    pageId: string;
    /**
     * Comments list
     *
     * @type {IComment[]}
     * @memberOf ICommentsListProps
     */
    comments: IComment[];
    /**
     *
     * @type {string}
     * @memberof ICommentsSectionProps
     */
    error: string;
    /**
     *
     * @param {IPageService} pageService
     * @param {IPostComment} commentData
     * @memberof ICommentsSectionProps
     */
    saveReply?(pageService: IPageService, commentData: IPostComment): void;
    /**
     *
     * @param {IPageService} pageService
     * @param {string} publicationId
     * @param {string} pageId
     * @param {boolean} descending
     * @param {number} top
     * @param {number} skip
     * @param {number[]} status
     * @memberof ICommentsSectionProps
     */
    fetchComments?(pageService: IPageService, publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): void;
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

export const DEFAULT_AMOUNT: number = 5;
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
        return new Date(dateObject.year, dateObject.monthValue - 1, dateObject.dayOfMonth).toLocaleString(language, DATE_OPTIONS);
    }

    constructor() {
        super();
        this.state = {
            showComments: DEFAULT_AMOUNT,
            showCommentReplies: [],
            showCommentPostReply: []
        };

        this._fetchComments = this._fetchComments.bind(this);
        this._showMoreComments = this._showMoreComments.bind(this);
    }

    public render(): JSX.Element {
        const { formatMessage, getLanguage } = this.context.services.localizationService;
        const { comments, error } = this.props;
        let { showComments } = this.state;

        const displayedComments = comments.slice(0, showComments);
        const totalCommentsCount: number = comments.length;
        const displayedCommentsCount: number = displayedComments.length;
        const language = getLanguage();

        const errorButtons = (
            <div>
                <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ click: this._fetchComments }}>
                    {formatMessage("control.button.retry")}
                </Button>
            </div>
        );
        const errorTitle = formatMessage("error.default.title");
        const errorMessages = [formatMessage("component.comments.list.error")];

        return error ? (
            <Error title={errorTitle} messages={errorMessages} buttons={errorButtons} />
        ) : (
            <div className="sdl-dita-delivery-comments-list">
                <FetchComments descending={true} />
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
                        <button className="sdl-button graphene sdl-button-purpose-ghost" onClick={this._showMoreComments}>
                            {formatMessage("component.comments.list.more")}
                        </button>
                        <div>{formatMessage("component.comments.list.amount", [displayedCommentsCount.toString(), totalCommentsCount.toString()])}</div>
                    </div>
                )}
            </div>
        );
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
                        {formatMessage(showCommentReplies[id] == true
                            ? "component.post.comment.hidereplies"
                            : "components.commentslist.comments",
                            [repliesCount.toString()])
                        }
                    </button>
                )}
                {showCommentPostReply[id] && (
                    <PostCommentReply
                        key={id}
                        parentId={id}
                        handleSubmit={this._handlePostReply}
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

    /**
     *
     * @memberof CommentsListPresentation
     */
    private _showMoreComments(): void {
        this.setState((prevState: ICommentsListState, props: ICommentsListProps) => {
            return { showComments: prevState.showComments + INCREMENT };
        });
    }

    /**
     *
     * @memberof CommentsListPresentation
     */
    private _handlePostReply = (event: React.FormEvent<HTMLFormElement>, data: IPostComment): void => {
        const { saveReply } = this.props;
        const { pageService } = this.context.services;

        event.preventDefault();
        if (saveReply) {
            saveReply(pageService, data);
        }
    }

    /**
     *
     * @private
     * @memberof CommentsSectionsPresentation
     */
    private _fetchComments(): void {
        const { fetchComments, publicationId, pageId } = this.props;
        const { pageService } = this.context.services;
        const { top, skip, status } = FetchComments.defaultProps as IFetchCommentsProperties;

        if (fetchComments && publicationId && pageId) {
            fetchComments(pageService, publicationId, pageId, true, top as number, skip as number, status as number[]);
        }
    }
}
