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
}

/**
 * Content Navigation component
 */
export const ContentNavigation = (props: IContentNavigationProps): JSX.Element => {
    const { navItems } = props;

    return Array.isArray(navItems) && (navItems.length > 0) ? (
        <nav className={"sdl-dita-delivery-content-navigation"}>
            <h3>Contents</h3>
            <ul>
                {
                    navItems.map((item: IContentNavigationItem, index: number) => {
                        return (
                            <li key={index}>
                                <Link to={item.url}>{item.title}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    ) : <nav className={"sdl-dita-delivery-content-navigation"}/>;
};
