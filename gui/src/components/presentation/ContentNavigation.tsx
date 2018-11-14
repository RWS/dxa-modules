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
import { Link } from "react-router";
import "components/presentation/styles/ContentNavigation";

/**
 * Content navigation component item interface
 *
 * @export
 * @interface IContentNavigationItem
 */
export interface IContentNavigationItem {
    /**
     * Identifier
     *
     * @type {string}
     * @memberOf IContentNavigationItem
     */
    id: string;
    /**
     * Page content
     *
     * @type {string | null}
     */
    title: string;
    /**
     * Header indention
     *
     * @type {number}
     */
    indention: number;
    /**
     * Page content anchors
     *
     * @type {string}
     */
    url: string;
}

/**
 * Content navigation component props
 *
 * @export
 * @interface IContentNavigationProps
 */
export interface IContentNavigationProps {
    /**
     * Page content anchor items
     *
     * @type {IContentNavigationItem}
     */
    navItems?: IContentNavigationItem[];
    /**
     * Active item id
     *
     * @type {string}
     * @memberOf IContentNavigationProps
     */
    activeNavItemId?: string;
}

/**
 * Content Navigation component
 */
export const ContentNavigation: React.StatelessComponent<IContentNavigationProps> = (props: IContentNavigationProps, context: IAppContext): JSX.Element => {
    const { navItems, activeNavItemId } = props;
    const { formatMessage } = context.services.localizationService;

    return Array.isArray(navItems) && (navItems.length > 0) ? (
        <nav className={"sdl-dita-delivery-content-navigation"}>
            <h3>{formatMessage("components.contentnavigation.title")}</h3>
            <ul>
                {
                    navItems.map((item: IContentNavigationItem, index: number) => {
                        const isActive = activeNavItemId && activeNavItemId === item.id;
                        return (
                            <li key={index} className={`indent-${item.indention}` + (isActive ? " active" : "")}>
                                <Link to={item.url}>{item.title}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    ) : <nav className={"sdl-dita-delivery-content-navigation"} />;
};

ContentNavigation.contextTypes = {
    services: PropTypes.object
} as React.ValidationMap<IAppContext>;
