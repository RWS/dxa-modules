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
    /**
     * Called whenever navigation to another page is requested
     *
     * @param {string} url Url
     *
     * @memberOf IPageProps
     */
    onNavigate(url: string): void;
}

/**
 * Content Navigation component
 */
export const ContentNavigation = (props: IContentNavigationProps): JSX.Element => {
    const { navItems, onNavigate } = props;

    /**
     * Executed when a hyperlink is clicked
     *
     * @param {React.MouseEvent} e Incoming mouse event
     */
    function _onNavigate(e: React.MouseEvent): void {
        e.preventDefault();
        const anchor = e.target as HTMLAnchorElement;
        const href = anchor.getAttribute("href");
        if (href) {
            onNavigate(href);
        }
    }

    return (
        <nav className={"sdl-dita-delivery-content-navigation"}>
            <h3>Contents</h3>
            <ul>
                {
                    Array.isArray(navItems) && navItems.map((item: IContentNavigationItem, index: number) => {
                        return (
                            <li key={index}>
                                <a href={item.url} onClick={_onNavigate}>{item.title}</a>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
};
