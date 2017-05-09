import * as React from "react";
import { Promise } from "es6-promise";
import { Link } from "react-router";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IAppContext } from "@sdl/dd/container/App/App";
import { path } from "utils/Path";

import "components/presentation/styles/Breadcrumbs";

/**
 * BreadcrumbItem
 *
 * @export
 * @interface IBreadcrumbItem
 */
export interface IBreadcrumbItem {
    /**
     * Breadcrumb Title
     *
     * @type {string}
     */
    title: string;
    /**
     * Breadcrumb Url
     *
     * @type {string}
     */
    url?: string;
}

/**
 * Breadcrumbs props
 *
 * @export
 * @interface IBreadcrumbsProps
 */
export interface IBreadcrumbsProps {
    /**
     * Current selected item
     *
     * @type {ITaxonomy}
     */
    selectedItem?: ITaxonomy | null;
    /**
     * Load items path for a specific item
     */
    loadItemPath: (item: ITaxonomy) => Promise<IBreadcrumbItem[]>;
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
     * @type {IBreadcrumbItem}
     */
    itemPath?: IBreadcrumbItem[];
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Breadcrumbs
 */
export class Breadcrumbs extends React.Component<IBreadcrumbsProps, IBreadcrumbsState> {

    /**
     * Context types
     *
     * @static
     * @type {React.ValidationMap<IAppContext>}
     * @memberOf Breadcrumbs
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    /**
     * Global context
     *
     * @type {IAppContext}
     * @memberOf Breadcrumbs
     */
    public context: IAppContext;

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Breadcrumbs.
     *
     */
    constructor() {
        super();
        this.state = {
            itemPath: undefined,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { selectedItem, loadItemPath } = this.props;
        if (selectedItem && selectedItem.id) {
            loadItemPath(selectedItem).then(
                path => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            itemPath: path,
                            error: undefined
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        // TODO: improve error handling
                        this.setState({
                            error: error
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
        const { selectedItem, loadItemPath } = this.props;
        const { itemPath } = nextState;
        const currentId = selectedItem ? selectedItem.id : null;
        const nextItem = nextProps.selectedItem;
        const nextId = nextItem ? nextItem.id : null;
        if (nextItem && nextItem.url) {
            if (nextId && (currentId !== nextId)) {
                loadItemPath(nextItem).then(
                    path => {
                        /* istanbul ignore else */
                        if (!this._isUnmounted) {
                            this.setState({
                                itemPath: path,
                                error: undefined
                            });
                        }
                    },
                    error => {
                        /* istanbul ignore else */
                        if (!this._isUnmounted) {
                            // TODO: improve error handling
                            this.setState({
                                error: error
                            });
                        }
                    });
            }
        } else if (currentId) {
            const nextPath = nextItem ? [{ title: nextItem.title, url: nextItem.url } as IBreadcrumbItem] : [];
            if (!itemPath || (nextPath.join("") !== itemPath.join(""))) {
                this.setState({
                    itemPath: nextPath
                });
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
        const { itemPath, error } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const { selectedItem } = this.props;
        const currentUrl = selectedItem ? selectedItem.url : null;
        const homeLabel = formatMessage("components.breadcrumbs.home");

        return (
            <div className={"sdl-dita-delivery-breadcrumbs"}>
                <ul>
                    <li>
                        <Link className="home" title={homeLabel} to={`${path.getRootPath()}home`}>{homeLabel}</Link>
                        <span className="separator" />
                    </li>
                    {
                        !error && Array.isArray(itemPath) && (
                            itemPath.map((item: IBreadcrumbItem, index: number) => {
                                return (
                                    <li key={index}>
                                        {
                                            (currentUrl !== item.url)
                                                ?
                                                (item.url) ?
                                                    <Link title={item.title} to={item.url}>{item.title}</Link>
                                                    :
                                                    <span className="abstract">{item.title}</span>
                                                : <span className="active">{item.title}</span>
                                        }
                                        {index < (itemPath.length - 1) ? <span className="separator" /> : ""}
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
