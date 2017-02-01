import * as React from "react";
import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { ActivityIndicator, TreeView } from "sdl-controls-react-wrappers";
import { TreeView as TreeViewControl, ITreeViewNode as IBaseTreeViewNode } from "sdl-controls";
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

        return (
            <nav className={"sdl-dita-delivery-toc"}>
                {error ? <ErrorToc message={formatMessage(error)} onRetry={_retryHandler} /> : null}
                {
                    props.rootItems ?
                        <TreeView
                            activeNodeIdPath={Array.isArray(props.activeItemPath) ?
                                props.activeItemPath.join("/") :
                                (firstRootNode ? firstRootNode.id : undefined)}
                            rootNodes={rootNodes}
                            onSelectionChanged={this._onSelectionChanged.bind(this)}
                            skin="graphene"/>
                        : !error ? <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")}/> : null
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
            const onSelectionChanged = this.props.onSelectionChanged;
            if (typeof onSelectionChanged === "function") {
                const selectedNode = nodes.length > 0 ? nodes[0] : null;
                if (selectedNode) {
                    const path = selectedNode ? selectedNode.getPath() : "";
                    onSelectionChanged(selectedNode.taxonomy, path.split("/"));
                }
            }
        }
    }

}
