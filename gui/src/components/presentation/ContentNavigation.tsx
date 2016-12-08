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
 * Table of contents
 */
export class ContentNavigation extends React.Component<IContentNavigationProps, {}> {
    //private _isUnmounted: boolean = false;

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { navItems } = this.props;
        return (
            <nav className={"sdl-dita-delivery-content-navigation"}>
                <h1>Contents</h1>
                <ul>
                    {
                        Array.isArray(navItems) && (
                            navItems.map((item: IContentNavigationItem, index: number) => {
                                return (
                                    <li key={index}>
                                        <a href={item.url}>{item.title}</a>
                                    </li>
                                );
                            })
                        )
                    }
                </ul>
            </nav>
        );
    }
}
