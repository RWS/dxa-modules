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
export const ContentNavigation = (props: IContentNavigationProps): JSX.Element => {
    const { navItems, activeNavItemId } = props;

    return (
        <nav className={"sdl-dita-delivery-content-navigation"}>
            <h3>Contents</h3>
            <ul>
                {
                    Array.isArray(navItems) && navItems.map((item: IContentNavigationItem, index: number) => {
                        const isActive = activeNavItemId && activeNavItemId === item.id;
                        return (
                            <li key={index} className={isActive ? "active" : ""}>
                                <Link to={item.url}>{item.title}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
};
