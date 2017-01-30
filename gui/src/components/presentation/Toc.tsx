import * as React from "react";
import * as ReactDOM from "react-dom";
import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { Button, ActivityIndicator, TreeView, ValidationMessage } from "sdl-controls-react-wrappers";
import { TreeView as TreeViewControl, ITreeViewNode as IBaseTreeViewNode, ValidationMessageType, ButtonPurpose } from "sdl-controls";
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

        return (
            <nav className={"sdl-dita-delivery-toc"}>
                {error ? <ValidationMessage messageType={ValidationMessageType.Error} message={error} /> : null}
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
        const indent: number = parseInt(element.style.textIndent || "0px", 10) / depth;
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
                    <Button purpose={ButtonPurpose.CONFIRM} events={{"click": _handleClick}}>{formatMessage("control.button.retry")}</Button>
                </li>
            </ul>
        );
    }

    private _injectRetryNode(parentNode: ITreeViewNode, callback: (childNodes: ITreeViewNode[]) => void): void {
        const emptyNode = parentNode.element.getElementsByClassName("children")[0];
        ReactDOM.render(this._createRetryNode(parentNode, callback), emptyNode);
    }

    private _createEmptyTreeViewNode(parentNode: ITreeViewNode): ITreeViewNode[] {
        const nodes: ITreeViewNode[] = [];
        const taxonomy: ITaxonomy = {
            title: "",
            hasChildNodes: false
        };

        const newNode = this._createNode(taxonomy, "", parentNode, () => {});
        nodes.push(newNode);
        return nodes;
    }

    private _convertToTreeViewNodes(taxonomies: ITaxonomy[], parentNode: ITreeViewNode | null = null): ITreeViewNode[] {
        const nodes: ITreeViewNode[] = taxonomies.map((taxonomy, index) => {
            return this._createNode(taxonomy, "TOPIC", parentNode, this._loadChildNodes.bind(this), index);
        });

        return nodes;
    }

    private _createNode(taxonomy: ITaxonomy, dataType: string, parentNode: ITreeViewNode | null = null, load: () => void, optId?: number): ITreeViewNode {
        let treeViewNode = TreeViewControl.prototype.createNodeFromObject({
            id: taxonomy.id || `${optId}`,
            name: taxonomy.title,
            dataType: dataType,
            parent: parentNode,
            children: null,
            isLeafNode: !taxonomy.hasChildNodes,
            load: load,
            isSelectable: true
        }) as ITreeViewNode;
        treeViewNode.taxonomy = taxonomy;

        return treeViewNode;
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
