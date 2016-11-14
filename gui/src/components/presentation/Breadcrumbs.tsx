import { Promise } from "es6-promise";
import { Link } from "react-router";
import { ISitemapItem } from "../../interfaces/ServerModels";
import "./styles/Breadcrumbs";

import { Url } from "../../utils/Url";

/**
 * Breadcrumbs props
 *
 * @export
 * @interface IBreadcrumbsProps
 */
export interface IBreadcrumbsProps {
    /**
     * Id of the current publication
     *
     * @type {string}
     */
    publicationId: string;
    /**
     * Title of the current publication
     *
     * @type {string}
     */
    publicationTitle: string;
    /**
     * Current selected item
     *
     * @type {ISitemapItem}
     */
    selectedItem?: ISitemapItem | null;
    /**
     * Load items path for a specific item
     */
    loadItemsPath: (publicationId: string, parentId: string) => Promise<ISitemapItem[]>;
}

/**
 * Breadcrumbs props
 *
 * @export
 * @interface IBreadcrumbsState
 */
export interface IBreadcrumbsState {
    /**
     * Current selected item path
     *
     * @type {ISitemapItem}
     */
    itemPath?: ISitemapItem[];
}

/**
 * Breadcrumbs
 */
export class Breadcrumbs extends React.Component<IBreadcrumbsProps, IBreadcrumbsState> {

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Breadcrumbs.
     *
     */
    constructor() {
        super();
        this.state = {
            itemPath: []
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { publicationId, selectedItem, loadItemsPath } = this.props;
        if (selectedItem && selectedItem.Url) {
            loadItemsPath(publicationId, selectedItem.Url).then(
                path => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            itemPath: path
                        });
                    }
                });
        }
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {IBreadcrumbsProps} nextProps Next props
     * @param {IBreadcrumbsState} nextState Next state
     */
    public componentWillUpdate(nextProps: IBreadcrumbsProps, nextState: IBreadcrumbsState): void {
        const { publicationId, selectedItem, loadItemsPath } = this.props;
        const currentUrl = selectedItem ? selectedItem.Url : null;
        const nextItem = nextProps.selectedItem;
        if (nextItem) {
            const nextUrl = nextItem.Url;
            if (nextUrl && (currentUrl !== nextUrl)) {
                loadItemsPath(nextProps.publicationId || publicationId, nextUrl).then(
                    path => {
                        /* istanbul ignore else */
                        if (!this._isUnmounted) {
                            this.setState({
                                itemPath: path
                            });
                        }
                    });
            }
            else if ((selectedItem && selectedItem.Id) != nextItem.Id) {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        itemPath: nextItem ? [nextItem] : []
                    });
                }
            }
        }
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { itemPath } = this.state;
        const { publicationId, publicationTitle } = this.props;
        const { selectedItem } = this.props;
        const currentUrl = selectedItem ? selectedItem.Url : null;
        return (
            <div className={"sdl-dita-delivery-breadcrumbs"}>
                <ul>
                    <li>
                        <Link title={publicationTitle} to={`${Url.getPublicationUrl(publicationId)}`}>{publicationTitle}</Link>
                    </li>
                    {
                        Array.isArray(itemPath) && (
                            itemPath.map((item: ISitemapItem, key: number) => {
                                return (
                                    <li key={key}>
                                        {
                                            (currentUrl != item.Url)
                                                ?
                                                (item.Url) ?
                                                    <Link title={item.Title} to={`${Url.getPageUrl(publicationId, item.Url)}`}>{item.Title}</Link>
                                                    :
                                                    <Link title={item.Title} to={`${Url.getPublicationUrl(publicationId)}`}>{item.Title}</Link>
                                                : <span>{item.Title}</span>
                                        }
                                    </li>
                                );
                            })
                        )
                    }
                </ul>
            </div>
        );
    }
}
