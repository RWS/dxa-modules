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
import "components/presentation/styles/Error";

/**
 * Error component props
 *
 * @export
 * @interface IErrorProps
 */
export interface IErrorProps {
    /**
     * Error title
     *
     * @type {string}
     * @memberOf IErrorProps
     */
    title: string;
    /**
     * Array of messages for error description
     *
     * @type {string[]}
     * @memberOf IErrorProps
     */
    messages: string[];
    /**
     * Buttons container for user reactions on an error
     *
     * @type {JSX.Element}
     * @memberOf IErrorProps
     */
    buttons: JSX.Element;
}

/**
 * Error component
 *
 * @export
 * @param {IErrorProps} props
 * @returns {JSX.Element}
 */
export const Error: React.StatelessComponent<IErrorProps> = (props: IErrorProps): JSX.Element => {
    const messages = props.messages.map((value, index) => <p key={index}>{value}</p>);

    return (
        <div className="sdl-dita-delivery-error">
            <h1>{props.title}</h1>
            <div>{messages}</div>
            <div className="sdl-dita-delivery-button-group">
                {props.buttons}
            </div>
        </div>
    );
};
