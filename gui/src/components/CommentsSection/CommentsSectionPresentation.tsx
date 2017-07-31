import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";
import { FetchComments, IFetchCommentsProperties } from "@sdl/dd/helpers/FetchComments";
import { CommentsList } from "@sdl/dd/CommentsList/CommentsList";
import { PostComment } from "@sdl/dd/PostComment/PostComment";
import { Error } from "@sdl/dd/presentation/Error";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";

import { IPageService } from "services/interfaces/PageService";
import { IPostCommentPresentationState } from "@sdl/dd/PostComment/PostCommentPresentation";
import { IPostComment } from "interfaces/Comments";

import "@sdl/dd/CommentsSection/styles/CommentsSection";

export interface ICommentsSectionProps {
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
    saveComment?(pageService: IPageService, commentData: IPostComment): void;

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

/**
 *
 * @export
 * @class CommentsSectionsPresentation
 * @extends {React.Component<ICommentsSectionProps, {}>}
 */
export class CommentsSectionsPresentation extends React.Component<ICommentsSectionProps, {}> {
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

    /**
     * Creates an instance of CommentsSectionsPresentation.
     * @memberof CommentsSectionsPresentation
     */
    constructor() {
        super();

        this.handlePostComment = this.handlePostComment.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
    }

    /**
     *
     * @memberof CommentsSectionsPresentation
     */
    public handlePostComment = (event: React.FormEvent<HTMLFormElement>, data: IPostCommentPresentationState): void => {
        const { pageService } = this.context.services;
        const { name, email, comment } = data;
        const { saveComment, publicationId, pageId } = this.props;

        event.preventDefault();
        if (saveComment) {
            saveComment(pageService, {
                publicationId: publicationId as string,
                pageId: pageId as string,
                username: name,
                email: email,
                content: comment,
                parentId: 0
            });
        }
    }

    /**
     *
     * @returns {JSX.Element}
     * @memberof CommentsSectionsPresentation
     */
    public render(): JSX.Element {
        const { error } = this.props;
        const { formatMessage } = this.context.services.localizationService;

        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": this.fetchComments }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        const errorTitle = formatMessage("error.default.title");
        const errorMessages = [
            formatMessage("component.comments.list.error")
        ];

        return (
            <div className="sdl-dita-delivery-comments-section">
                {error
                    ? <Error title={errorTitle} messages={errorMessages} buttons={errorButtons} />
                    : <div>
                        <PostComment handleSubmit={this.handlePostComment} />
                        <FetchComments descending={true} />
                        <CommentsList />
                    </div>
                }
            </div>
        );
    }

    /**
     *
     * @private
     * @memberof CommentsSectionsPresentation
     */
    private fetchComments(): void {
        const { fetchComments, publicationId, pageId } = this.props;
        const { pageService } = this.context.services;
        const { top, skip, status } = FetchComments.defaultProps as IFetchCommentsProperties;

        if (fetchComments && publicationId && pageId) {
            fetchComments(pageService, publicationId, pageId, true, top as number, skip as number, status as number[]);
        }
    }
}
