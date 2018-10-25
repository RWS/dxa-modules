import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";
import { CommentsList } from "@sdl/dd/CommentsList/CommentsList";
import { PostComment } from "@sdl/dd/PostComment/PostComment";

import { IPageService } from "services/interfaces/PageService";
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
     * @param {IPageService} pageService
     * @param {IPostComment} commentData
     * @memberof ICommentsSectionProps
     */
    saveComment?(pageService: IPageService, commentData: IPostComment): void;
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
    }

    /**
     *
     * @memberof CommentsSectionsPresentation
     */
    public handlePostComment = (event: React.FormEvent<HTMLFormElement>, data: IPostComment): void => {
        const { pageService } = this.context.services;
        const { saveComment } = this.props;

        event.preventDefault();
        if (saveComment) {
            saveComment(pageService, data);
        }
    }

    /**
     *
     * @returns {JSX.Element}
     * @memberof CommentsSectionsPresentation
     */
    public render(): JSX.Element {
        return (
            <div className="sdl-dita-delivery-comments-section">
                <div>
                    <PostComment handleSubmit={this.handlePostComment} />
                    <CommentsList />
                </div>
            </div>
        );
    }
}
