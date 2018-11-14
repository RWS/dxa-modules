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
import { IndexLink } from "react-router";
import { path } from "utils/Path";
import { LanguageDropdown } from "@sdl/dd/Dropdown/LanguageDropdown";
import { IAppContext } from "@sdl/dd/container/App/App";

import "./styles/TopBar";

/**
 * TopBar props
 *
 * @export
 * @interface ITopBarProps
 */
export interface ITopBarProps {
    /**
     * Children
     *
     * @type {React.ReactNode}
     * @memberOf INavigationMenuProps
     */
    children?: React.ReactNode;
}

/**
 * TopBar
 */
export const TopBar: React.StatelessComponent<ITopBarProps> = (props: ITopBarProps, context: IAppContext): JSX.Element => {
    const { children } = props;

    return (
        <div className={"sdl-dita-delivery-topbar"}>
            <header>
                <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                    <IndexLink to={`${path.getRootPath()}home`} />
                </div>
                <div className={"spacer"} />
                {children}
                <div className={"sdl-dita-delivery-topbar-language"} >
                    <span />
                </div>
                <LanguageDropdown />
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div>
    );
};

TopBar.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
