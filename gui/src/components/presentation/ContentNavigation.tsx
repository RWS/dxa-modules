import { IAppContext } from "components/container/App";
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
export const ContentNavigation: React.StatelessComponent<IContentNavigationProps> = (props: IContentNavigationProps, context: IAppContext): JSX.Element => {
    const { navItems } = props;

    return (
        <nav className={"sdl-dita-delivery-content-navigation"}>
            <h3>{context.services.localizationService.formatMessage("components.contentnavigation.title")}</h3>
            <ul>
                {
                    Array.isArray(navItems) && navItems.map((item: IContentNavigationItem, index: number) => {
                        return (
                            <li key={index}>
                                <Link to={item.url}>{item.title}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
};

ContentNavigation.contextTypes = {
    services: React.PropTypes.object
} as React.ValidationMap<IAppContext>;
