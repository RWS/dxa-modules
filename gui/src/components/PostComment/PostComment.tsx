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

import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import {
    PostCommentPresentation,
    IPostCommentPresentationProps,
    IPostCommentPresentationDispatchProps
} from "@sdl/dd/PostComment/PostCommentPresentation";
import { getCurrentLocation, getPubById, getPageById } from "store/reducers/Reducer";
import { getPostCommentErrorMessage, commentIsSaving as commentIsSavingSelector } from "store/reducers/Reducer";

const mapStateToProps = (state: IState, ownProps: IPostCommentPresentationProps): IPostCommentPresentationDispatchProps => {
    const { pageId, publicationId } = getCurrentLocation(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const { title: pageTitle } = getPageById(state, publicationId, pageId);

    const error = getPostCommentErrorMessage(state, publicationId, pageId);
    const commentIsSaving = commentIsSavingSelector(state, publicationId, pageId);

    return {
        error,
        pageId,
        pageTitle,
        publicationId,
        publicationTitle,
        language: state.language,
        commentIsSaving
    };
};

export const PostComment = connect(mapStateToProps)(PostCommentPresentation);
