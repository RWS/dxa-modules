import { Promise } from "es6-promise";
import { ISitemapItem } from "../../interfaces/ServerModels";
import "./styles/Toc";
import "../controls/styles/TreeView";

// Global Catalina dependencies
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;
import TreeView = SDL.ReactComponents.TreeView;
import IBaseTreeViewNode = SDL.UI.Controls.ITreeViewNode;

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
     * @type {ISitemapItem[]}
     */
    rootItems: ISitemapItem[] | undefined;
    /**
     * Load child items for a specific item
     */
    loadChildItems: (parentId: string) => Promise<ISitemapItem[]>;
    /**
     * Triggered whenever the selected item in the toc changes
     */
    onSelectionChanged?: (sitemapItem: ISitemapItem, path: string[]) => void;
    /**
     * An error prevented the toc from rendering
     *
     * @type {string}
     */
    error?: string;
}

interface ITreeViewNode extends IBaseTreeViewNode {
    sitemapItem: ISitemapItem;
}

/**
 * Table of contents
 */
export class Toc extends React.Component<ITocProps, { error: string | null | undefined }> {

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

        return (
            <div className={"sdl-dita-delivery-toc"}>
                {error ? <ValidationMessage messageType={SDL.UI.Controls.ValidationMessageType.Error} message={error} /> : null}
                {
                    props.rootItems ?
                        <TreeView
                            activeNodeIdPath={Array.isArray(props.activeItemPath) ? props.activeItemPath.join("/") : undefined}
                            rootNodes={this._convertToTreeViewNodes(props.rootItems)}
                            useCommonUILibraryScrollView={false}
                            onSelectionChanged={this._onSelectionChanged.bind(this)} />
                        : !error ? <ActivityIndicator /> : null
                }
            </div>
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

    private _convertToTreeViewNodes(sitemapItems: ISitemapItem[], parentNode: ITreeViewNode | null = null): ITreeViewNode[] {
        const nodes: ITreeViewNode[] = [];
        // Check if Catalina is loaded, on a server environment this is typically not the case
        // TODO: https://jira.sdl.com/browse/SDLUI-1980
        if (SDL && SDL.UI && SDL.UI.Controls) {
            const TreeViewControl = SDL.UI.Controls.TreeView;
            let count = 0;
            for (let sitemapItem of sitemapItems) {
                let newNode = TreeViewControl.prototype.createNode(sitemapItem.Id || count.toString(), sitemapItem.Title, "TOPIC",
                    parentNode, null, !sitemapItem.HasChildNodes, this._loadChildNodes.bind(this), true) as ITreeViewNode;
                newNode.sitemapItem = sitemapItem;
                nodes.push(newNode);
                count++;
            }
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
                    onSelectionChanged(selectedNode.sitemapItem, path.split("/"));
                }
            }
        }
    }

}
