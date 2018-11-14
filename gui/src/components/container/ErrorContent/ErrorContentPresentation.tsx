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

import * as ClassNames from "classnames";
import * as React from "react";
import * as PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { path } from "utils/Path";
import { SearchBar } from "@sdl/dd/presentation/SearchBar";
import { Error } from "@sdl/dd/presentation/Error";
import { IAppContext } from "@sdl/dd/container/App/App";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";
import { Url } from "utils/Url";

import { IError } from "interfaces/Error";

import "./ErrorContent.less";
import "components/controls/styles/Button";

/**
 * Error content component props
 *
 * @export
 * @interface IErrorContentProps
 */
export interface IErrorContentProps {
    /**
     * Error object information to render on the page
     *
     * @type {IError}
     */
    error?: IError;

    /**
     * Content direction
     *
     * @type {("ltr" | "rtl")}
     * @memberOf IErrorContentProps
     */
    direction?: "ltr" | "rtl";
}

/**
 * Error content component
 *
 * @export
 * @param {IErrorContentProps} props
 * @returns {JSX.Element}
 */
export const ErrorContentPresentation: React.StatelessComponent<IErrorContentProps> = (props: IErrorContentProps, context: IAppContext): JSX.Element => {
    const { formatMessage } = context.services.localizationService;
    const _goHome = (): void => {
        if (browserHistory) {
            browserHistory.push(path.getRootPath());
        }
    };

    const errorButtons = <div>
        <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _goHome }}>{formatMessage("components.breadcrumbs.home")}</Button>
    </div>;

    const { error, direction } = props;
    const errorMessages = [formatMessage("error.url.not.found"), formatMessage("error.default.message")];
    const errorTitle = error && error.statusCode ?
        `${error.statusCode} - ${formatMessage("error.default.title")}` :
        formatMessage("error.default.title");

    const appClass = ClassNames(direction, "sdl-dita-delivery-error-content");

    return (
        <section className={appClass}>
            <SearchBar
                placeholderLabel={formatMessage("components.searchbar.placeholder")}
                onSearch={query => {
                    if (browserHistory) {
                        browserHistory.push(Url.getSearchUrl(query));
                    }
                }} />
            <div className={"sdl-dita-delivery-error-page"}>
                <Error
                    title={errorTitle}
                    messages={errorMessages}
                    buttons={errorButtons} />
            </div>
        </section>
    );
};

ErrorContentPresentation.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
