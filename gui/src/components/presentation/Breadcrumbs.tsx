import { Promise } from "es6-promise";
import { Link } from "react-router";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IAppContext } from "components/container/App";
import { Url } from "utils/Url";

import "components/presentation/styles/Breadcrumbs";

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
     * @type {ITaxonomy}
     */
    selectedItem?: ITaxonomy | null;
    /**
     * Load items path for a specific item
     */
    loadItemsPath: (publicationId: string, parentId: string) => Promise<ITaxonomy[]>;
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
     * @type {ITaxonomy}
     */
    itemPath?: ITaxonomy[];
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
            itemPath: []
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { publicationId, selectedItem, loadItemsPath } = this.props;
        if (selectedItem && selectedItem.id) {
            loadItemsPath(publicationId, selectedItem.id).then(
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
        const { itemPath } = nextState;
        const currentId = selectedItem ? selectedItem.id : null;
        const nextItem = nextProps.selectedItem;
        const nextId = nextItem ? nextItem.id : null;
        if (nextItem && nextItem.url) {
            if (nextId && (currentId !== nextId)) {
                loadItemsPath(nextProps.publicationId || publicationId, nextId).then(
                    path => {
                        /* istanbul ignore else */
                        if (!this._isUnmounted) {
                            this.setState({
                                itemPath: path
                            });
                        }
                    });
            }
        } else if (currentId) {
            const nextPath = nextItem ? [nextItem] : [];
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
        const { itemPath } = this.state;
        const { publicationId, publicationTitle } = this.props;
        const { localizationService } = this.context.services;
        const { selectedItem } = this.props;
        const currentUrl = selectedItem ? selectedItem.url : null;
        const homeLabel = localizationService.formatMessage("components.breadcrumbs.home");

        return (
            <div className={"sdl-dita-delivery-breadcrumbs"}>
                <ul>
                    <li>
                        <Link className="home" title={homeLabel} to="/home">{homeLabel}</Link>
                        <span className="separator" />
                    </li>
                    <li>
                        <Link title={publicationTitle} to={`${Url.getPublicationUrl(publicationId, publicationTitle)}`}>{publicationTitle}</Link>
                        <span className="separator" />
                    </li>
                    {
                        Array.isArray(itemPath) && (
                            itemPath.map((item: ITaxonomy, index: number) => {
                                return (
                                    <li key={index}>
                                        {
                                            (currentUrl !== item.url)
                                                ?
                                                (item.url) ?
                                                    <Link title={item.title} to={item.url}>{item.title}</Link>
                                                    :
                                                    <Link title={item.title} to={`${Url.getPublicationUrl(publicationId, publicationTitle)}`}>{item.title}</Link>
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
