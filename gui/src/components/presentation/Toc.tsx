import * as React from "react";
import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { ActivityIndicator, TreeView, ValidationMessage } from "sdl-controls-react-wrappers";
import { TreeView as TreeViewControl, ITreeViewNode as IBaseTreeViewNode, ValidationMessageType } from "sdl-controls";
import { IAppContext } from "components/container/App";

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
}

interface ITreeViewNode extends IBaseTreeViewNode {
    taxonomy: ITaxonomy;
}

/**
 * Table of contents
 */
export class Toc extends React.Component<ITocProps, { error: string | null | undefined }> {

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
        const activeNodeIdPath = this._getNodeIdPath(props.activeItemPath, firstRootNode);

        return (
            <nav className={"sdl-dita-delivery-toc"}>
                {error ? <ValidationMessage messageType={ValidationMessageType.Error} message={error} /> : null}
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
        this.setState({
            error: error
        });
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
        const currentPath = this._getNodeIdPath(props.activeItemPath, currentFirstRootNode);
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
                    callback(this._convertToTreeViewNodes(children, node));
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        error: error
                    });
                    callback([]);
                }
            });
    }

    private _convertToTreeViewNodes(taxonomies: ITaxonomy[], parentNode: ITreeViewNode | null = null): ITreeViewNode[] {
        const nodes: ITreeViewNode[] = [];

        let count = 0;
        for (let taxonomy of taxonomies) {
            let newNode = TreeViewControl.prototype.createNode(
                taxonomy.id || count.toString(),
                taxonomy.title,
                "TOPIC",
                parentNode,
                null,
                !taxonomy.hasChildNodes,
                this._loadChildNodes.bind(this),
                true) as ITreeViewNode;
            newNode.taxonomy = taxonomy;
            nodes.push(newNode);
            count++;
        }

        return nodes;
    }

    private _onSelectionChanged(nodes: ITreeViewNode[]): void {
        /* istanbul ignore else */
        if (!this._isUnmounted) {
            const { activeItemPath, rootItems } = this.props;
            const onSelectionChanged = this.props.onSelectionChanged;
            const selectedNode = nodes.length > 0 ? nodes[0] : null;
            const firstRootNodeId = rootItems && rootItems[0] ? rootItems[0].id : null;
            const activeId = activeItemPath ? activeItemPath[activeItemPath.length - 1] : firstRootNodeId;
            // Check if expanding is finished (expanding state is reset when the component is updated)
            if (this._isExpanding) {
                this._isExpanding = !(selectedNode && selectedNode.id === activeId);
            }
            if (!this._isExpanding && selectedNode && typeof onSelectionChanged === "function") {
                const path = selectedNode ? selectedNode.getPath() : "";
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
