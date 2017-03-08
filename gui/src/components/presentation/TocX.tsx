import * as React from "react";
import * as ReactDOM from "react-dom";
import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Button, ActivityIndicator, TreeView } from "sdl-controls-react-wrappers";
import { TreeView as TreeViewControl, ITreeViewNode as IBaseTreeViewNode, ButtonPurpose } from "sdl-controls";
import { IAppContext } from "components/container/App";
import { ErrorToc } from "components/presentation/ErrorToc";

import "components/presentation/styles/Toc";
import "components/controls/styles/TreeView";

/**
 * Toc component props
 *
 * @export
 * @interface ITocProps
 */
export interface ITocProps {
    /**
     * Path of the active item in the tree
     *
     * @type {string[]}
     */
    activeItemPath?: string[];
    /**
     * Root items, showed on initial render
     *
     * @type {ITaxonomy[]}
     */
    rootItems: ITaxonomy[] | undefined;
    /**
     * Load child items for a specific item
     */
    loadChildItems: (parentId: string) => Promise<ITaxonomy[]>;
    /**
     * Triggered whenever the selected item in the toc changes
     */
    onSelectionChanged?: (sitemapItem: ITaxonomy, path: string[]) => void;
    /**
     * An error prevented the toc from rendering
     *
     * @type {string}
     */
    error?: string;
    /**
     * Load Toc root items
     *
     */
    onRetry: () => void;
}

interface ITreeViewNode extends IBaseTreeViewNode {
    taxonomy: ITaxonomy;
}

interface ITaxonomyNodeOptions {
    id?: string;
    dataType?: string;
    parentNode?: ITreeViewNode | null;
    load?: (node: ITreeViewNode, callback: (nodes: ITreeViewNode[]) => void) => void;
}

const TaxonomyType = {
    TOPIC: "topic",
    DUMMY: ""
};

/**
 * Function that generates unique value every time it"s called.
 */
const getUniqueTaxonomyId = ((count: number): () => string => {
    return (): string => `taxonomy-${count++}`;
})(0);

/**
 * Table of contents
 */
export class TocX extends React.Component<ITocProps, { error: string | null | undefined }> {

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
    private _isExpanding: boolean = false;
    private _currentActiveNode: ITreeViewNode | null = null;

    /**
     * Creates an instance of Toc.
     *
     */
    constructor() {
        super();
        this.state = {
            error: null
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const props = this.props;
        const { error } = this.state;
        const rootNodes = this._convertToTreeViewNodes(props.rootItems || []);
        const firstRootNode = rootNodes.length > 0 ? rootNodes[0] : null;
        const { formatMessage } = this.context.services.localizationService;
        const _retryHandler = (): void => {
            props.onRetry();
        };
        const activeNodeIdPath = this._getNodeIdPath(props.activeItemPath, firstRootNode);

        return (
            <nav className={"sdl-dita-delivery-toc"}>
                {error ? <ErrorToc message={formatMessage("error.toc.not.found")} onRetry={_retryHandler} /> : null}
                {
                    props.rootItems ?
                        <TreeView
                            activeNodeIdPath={activeNodeIdPath}
                            rootNodes={rootNodes}
                            onSelectionChanged={this._onSelectionChanged.bind(this)}
                            skin="graphene" />
                        : !error ? <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} /> : null
                }
                {props.children}
            </nav>
        );
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { error } = this.props;
        this.setState({ error });
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {ITocProps} nextProps
     */
    public componentWillReceiveProps(nextProps: ITocProps): void {
        const props = this.props;
        const currentRootNodes = this._convertToTreeViewNodes(props.rootItems || []);
        const currentFirstRootNode = currentRootNodes.length > 0 ? currentRootNodes[0] : null;
        const activeNodePath = this._currentActiveNode ? this._currentActiveNode.getPath().split("/") : undefined;
        const currentPath = this._getNodeIdPath(activeNodePath, currentFirstRootNode);
        const nextRootNodes = this._convertToTreeViewNodes(props.rootItems || []);
        const nextFirstRootNode = nextRootNodes.length > 0 ? nextRootNodes[0] : null;
        const nextPath = this._getNodeIdPath(nextProps.activeItemPath, nextFirstRootNode);
        this._isExpanding = currentPath !== nextPath;

        this.setState({
            error: nextProps.error
        });
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    private _loadChildNodes(node: ITreeViewNode, callback: (childNodes: ITreeViewNode[]) => void): void {
        const props = this.props;
        props.loadChildItems(node.id)
            .then(
            children => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._removeRetryNode(node);
                    callback(this._convertToTreeViewNodes(children, node));
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    callback(this._createEmptyTreeViewNode(node));
                    this._injectRetryNode(node, callback);
                }
            });
    }

    private _getIndent(parentNode: ITreeViewNode): string {
        const { element, depth } = parentNode;
        const { textIndent } = element.style;
        const indent: number = textIndent && parseInt(textIndent, 10) ? parseInt(textIndent, 10) / depth : 19;
        return `${indent * (depth + 1)}px`;
    }

    private _removeRetryNode(parentNode: ITreeViewNode): void {
        const el = parentNode.element.querySelector(`ul[id="${parentNode.id}"]`);
        if (el && el.parentElement) {
            const parent = el.parentElement;
            ReactDOM.unmountComponentAtNode(parent);
            parent.remove();
        }
    }

    private _createRetryNode(parentNode: ITreeViewNode, callback: (childNodes: ITreeViewNode[]) => void): JSX.Element {
        const { formatMessage } = this.context.services.localizationService;

        const _handleClick = (): void => this._loadChildNodes(parentNode, callback);

        return (
            <ul id={parentNode.id} className="sdl-dita-delivery-toc-list-fail">
                <li style={{ paddingLeft: this._getIndent(parentNode) }}>
                    <p>{formatMessage("error.toc.items.not.found")}</p>
                    <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{"click": _handleClick}}>{formatMessage("control.button.retry")}</Button>
                </li>
            </ul>
        );
    }

    private _injectRetryNode(parentNode: ITreeViewNode, callback: (childNodes: ITreeViewNode[]) => void): void {
        const emptyNode = parentNode.element.getElementsByClassName("children")[0];
        ReactDOM.render(this._createRetryNode(parentNode, callback), emptyNode);
    }

    private _createEmptyTreeViewNode(parentNode: ITreeViewNode): ITreeViewNode[] {
        const emptyTaxonomy: ITaxonomy = {
            title: "",
            hasChildNodes: false
        };

        return [this._createTaxonomyNode(emptyTaxonomy, {
            parentNode,
            dataType: TaxonomyType.DUMMY
        })];
    }

    private _convertToTreeViewNodes(taxonomies: ITaxonomy[], parentNode: ITreeViewNode | null = null): ITreeViewNode[] {
        return taxonomies.map((taxonomy) => {
            return this._createTaxonomyNode(taxonomy, {
                parentNode,
                load: this._loadChildNodes.bind(this)
            });
        });
    }

    /**
     * This method is just a wrapper for TreeViewControl.prototype.createNode,
     * just because we don"t want to write this long list of arguments every time.
     */
    private _createTaxonomyNode(taxonomy: ITaxonomy, {
            dataType = TaxonomyType.TOPIC,
            parentNode = null,
            load = () => {}
        }: ITaxonomyNodeOptions = {}
    ): ITreeViewNode {
        const taxonomyNode = TreeViewControl.prototype.createNodeFromObject({
            id: taxonomy.id || getUniqueTaxonomyId(),
            name: taxonomy.title,
            isLeafNode: !taxonomy.hasChildNodes,
            dataType,
            parent: parentNode,
            children: null,
            load,
            isSelectable: true
        }) as ITreeViewNode;
        taxonomyNode.taxonomy = taxonomy;

        return taxonomyNode;
    }

    private _onSelectionChanged(nodes: ITreeViewNode[]): void {
        console.log("WTF._onSelectionChanged");
        /* istanbul ignore else */
        if (!this._isUnmounted) {
            const { activeItemPath, rootItems } = this.props;
            const onSelectionChanged = this.props.onSelectionChanged;
            const selectedNode = nodes.length > 0 ? nodes[0] : null;
            this._currentActiveNode = selectedNode;
            const firstRootNodeId = rootItems && rootItems[0] ? rootItems[0].id : null;
            const activeId = activeItemPath ? activeItemPath[activeItemPath.length - 1] : firstRootNodeId;
            // Check if expanding is finished (expanding state is reset when the component is updated)
            if (this._isExpanding) {
                this._isExpanding = !(selectedNode && selectedNode.id === activeId);
            }
            if (!this._isExpanding && selectedNode && typeof onSelectionChanged === "function") {
                const path = selectedNode ? selectedNode.getPath() : "";
                console.log(path);
                onSelectionChanged(selectedNode.taxonomy, path.split("/"));
            }
        }
    }

    private _getNodeIdPath(activeItemPath: string[] | undefined, firstRootNode: ITreeViewNode | null): string | undefined {
        return Array.isArray(activeItemPath) ?
            activeItemPath.join("/") :
            (firstRootNode ? firstRootNode.id : undefined);
    }

}
