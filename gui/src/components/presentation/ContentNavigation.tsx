import * as React from "react";
import { IAppContext } from "components/container/App/App";
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
    services: React.PropTypes.object
} as React.ValidationMap<IAppContext>;
