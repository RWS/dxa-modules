/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
