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
