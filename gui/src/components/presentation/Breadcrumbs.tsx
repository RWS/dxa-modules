import * as React from "react";
import { Promise } from "es6-promise";
import { Link } from "react-router";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IAppContext } from "@sdl/dd/container/App/App";
import { path } from "utils/Path";

import { Dropdown } from "@sdl/dd/Dropdown/Dropdown";

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
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
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
                        !error && Array.isArray(itemPath) && this._renderBreadcrumbs(itemPath, currentUrl || null)
                    }
                </ul>
            </div>
        );
    }

    /**
     * Render the list of breadcrumbs
     *
     * @returns {JSX.Element}
     */
    private _renderBreadcrumbs(itemPath: IBreadcrumbItem[], currentUrl: string | null): JSX.Element[] | null {
        const { router } = this.context;
        // Working on items path copy;
        itemPath = itemPath.slice();

        // Isolate last element, so it will be rendered isolated
        const lastItem = itemPath.pop();
        let lindex = 0;

        // Render breadcrumbs for Desktop;
        let breadCrumbs: JSX.Element[] = itemPath.map(
            (item: IBreadcrumbItem) => {
                return (
                    <li key={lindex++}>
                        {
                            (currentUrl !== item.url)
                                ?
                                (item.url) ?
                                    <Link title={item.title} to={item.url}>{item.title}</Link>
                                    :
                                    <span className="abstract">{item.title}</span>
                                : <span className="active">{item.title}</span>
                        }
                        <span className="separator" />
                    </li>);
            });

        // Render responcive breadcrumbs;
        const toDropdownFormat = (item: IBreadcrumbItem) => ({ "text": item.title, "value": item.url || "" });
        const itemsToRender = itemPath.filter(item => item.url != null);
        if (itemsToRender.length > 0) {
            breadCrumbs.push(
                <li className="dd-selector" key={lindex++}>
                    <Dropdown
                        placeHolder={itemsToRender.length.toString()}
                        items={itemsToRender.map(toDropdownFormat)}
                        onChange={(url: string) => {
                            if (router) {
                                router.push(url);
                            }
                        }} />
                    <span className="separator" />
                </li>
            );
        }

        // Render last element, as it will be shown in both cases
        breadCrumbs.push(
            <li key={lindex++}>
                {
                    lastItem && ((currentUrl !== lastItem.url)
                        ?
                        (lastItem.url) ?
                            <Link title={lastItem.title} to={lastItem.url}>{lastItem.title}</Link>
                            :
                            <span className="abstract">{lastItem.title}</span>
                        : <span className="active">{lastItem.title}</span>)
                }
            </li>);

        return breadCrumbs;
    }
}
