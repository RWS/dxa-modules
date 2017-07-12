import * as React from "react";
import * as ReactDOM from "react-dom";
import { Promise } from "es6-promise";
import { Link, browserHistory } from "react-router";
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
    /**
     * Number of shown element in breadcrumbs
     *
     * @type {number}
     */
    itemsToShow?: number;
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
            error: undefined,
            itemsToShow: 0
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

    public componentDidMount(): void {
        window.addEventListener("resize", this._recalculateHiddenPath.bind(this));
        this._recalculateHiddenPath();
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

    public componentDidUpdate(): void {
        this._recalculateHiddenPath();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
        window.removeEventListener("resize", this._recalculateHiddenPath.bind(this));
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
                <ul className="breadcrumbs">
                    <li>
                        <Link className="home" title={homeLabel} to={`${path.getRootPath()}home`}>{homeLabel}</Link>
                    </li>
                    {
                        !error && Array.isArray(itemPath) && this._renderBreadcrumbs(itemPath, currentUrl || null)
                    }
                </ul>
            </div>
        );
    }

    private _recalculateHiddenPath(): void {
        const { itemsToShow } = this.state;
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            let ticking = false;
            const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
            if (domNode) {
                const elementsToShow = this._getItemsToShow(domNode.querySelector("ul.breadcrumbs") as HTMLElement);
                if (!ticking && (itemsToShow != elementsToShow.length)) {
                    requestAnimationFrame((): void => {
                        /* istanbul ignore if */
                        if (!this._isUnmounted) {
                            this.setState({
                                itemsToShow: elementsToShow.length
                            });
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }
        }
    }

    private _getItemsToShow(breadcrumbs: HTMLElement): HTMLElement[] {
        let elementsToShow: HTMLElement[] = [];
        const breadcrumbsContainer = breadcrumbs.parentElement as HTMLElement;
        let lastElement = breadcrumbs.lastElementChild as HTMLElement;
        const calc = () => elementsToShow.map(x => x.offsetWidth).reduce((x: number, y: number) => {
            return x + y;
        }, 0);

        const homeElement = breadcrumbs.firstElementChild && (breadcrumbs.firstElementChild as HTMLElement);
        const ddSelectorElement = breadcrumbs.querySelector("li.dd-selector") as HTMLElement;
        if (homeElement) {
            const offset = homeElement.clientWidth + (ddSelectorElement && ddSelectorElement.clientWidth);
            while (lastElement
                && (lastElement !== (ddSelectorElement || homeElement))
                && (offset + lastElement.offsetWidth + calc() < breadcrumbsContainer.clientWidth)) {
                elementsToShow.push(lastElement);
                lastElement = lastElement.previousElementSibling as HTMLElement;
            }

            // If there is no elements to show, then we should show at lest the last one.
            if (elementsToShow.length == 0) {
                elementsToShow.push(breadcrumbs.lastElementChild as HTMLElement);
            }
        }
        return elementsToShow;
    }

    /**
     * Render the list of breadcrumbs
     *
     * @returns {JSX.Element}
     */
    private _renderBreadcrumbs(itemPath: IBreadcrumbItem[], currentUrl: string | null): JSX.Element[] | null {
        const { itemsToShow } = this.state;
        // Working on items path copy;
        itemPath = itemPath.slice();

        // Isolate last element, so it will be rendered isolated
        const lastItem = itemPath.pop();
        const shownItems: number = (itemsToShow != null && itemsToShow > 0) ? (itemsToShow - 1) : 0;
        let lindex = 0;

        let breadCrumbs: JSX.Element[] = [];

        // Render responsive breadcrumbs;
        const toDropdownFormat = (item: IBreadcrumbItem) => ({ "text": item.title, "value": item.url || "" });
        const itemsToRender = itemPath.slice(0, itemPath.length - shownItems).filter(item => item.url != null);
        if (itemsToRender.length > 0) {
            breadCrumbs.push(
                <li className="dd-selector" key={lindex++} data-items={itemsToRender.length}>
                    <Dropdown
                        placeHolder={`${itemsToRender.length}`}
                        items={itemsToRender.map(toDropdownFormat)}
                        onChange={(url: string) => {
                            if (browserHistory) {
                                browserHistory.push(url);
                            }
                        }} />
                </li>
            );
        }

        // Render breadcrumbs for Desktop;
        breadCrumbs.push(...itemPath.map(
            (item: IBreadcrumbItem, showIndex: number) => {
                return (
                    <li key={lindex++} style={(itemPath.length - 1 - showIndex) < shownItems ? { "position": "inherit" } : {}}>
                        {
                            (currentUrl !== item.url)
                                ?
                                (item.url) ?
                                    <Link title={item.title} to={item.url}>{item.title}</Link>
                                    :
                                    <span className="abstract">{item.title}</span>
                                : <span className="active">{item.title}</span>
                        }
                    </li>);
            }));

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
