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
import "components/presentation/styles/ErrorToc";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";
import { IAppContext } from "@sdl/dd/container/App/App";

import "components/controls/styles/Button";

/**
 * ErrorToc component props
 *
 * @export
 * @interface IErrorTocProps
 */
export interface IErrorTocProps {
    /**
     * Message for error description
     *
     * @type {string}
     * @memberOf IErrorTocProps
     */
    message: string;

    /**
     * Handler for getting Toc
     *
     * @type {string}
     * @memberOf IErrorTocProps
     */
    onRetry: () => void;
}

/**
 * Error Toc component
 *
 * @export
 * @param {IErrorTocProps} props
 * @returns {JSX.Element}
 */
export const ErrorToc: React.StatelessComponent<IErrorTocProps> = (props: IErrorTocProps, context: IAppContext): JSX.Element => {
    const { message, onRetry } = props;
    const { formatMessage } = context.services.localizationService;

    return (
        <div className="sdl-dita-delivery-error-toc">
            <div className="sdl-dita-delivery-error-toc-content">
                <div className="sdl-dita-delivery-error-toc-message">{message}</div>
                <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{"click": onRetry}}>{formatMessage("control.button.retry")}</Button>
            </div>
        </div>
    );
};

ErrorToc.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
