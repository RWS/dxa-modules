/// <reference path="../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
    import TreeView = SDL.ReactComponents.TreeView;
    import IBaseTreeViewNode = SDL.UI.Controls.ITreeViewNode;
    import ISitemapItem = Server.Models.ISitemapItem;

    /**
     * Toc component props
     *
     * @export
     * @interface ITocProps
     */
    export interface ITocProps {
        /**
         * Root items, showed on initial render
         *
         * @type {Server.Models.ISitemapItem[]}
         */
        rootItems: Server.Models.ISitemapItem[];
        /**
         * Load child items for a specific item
         */
        loadChildItems: (parentId: string, callback: (error: string, children: ISitemapItem[]) => void) => void;
        /**
         * Triggered whenever the selected item in the toc changes
         */
        onSelectionChanged?: (sitemapItem: ISitemapItem) => void;
    }

    interface ITreeViewNode extends IBaseTreeViewNode {
        sitemapItem: ISitemapItem;
    }

    /**
     * Table of contents
     */
    export class Toc extends React.Component<ITocProps, {}> {

        private _isUnmounted: boolean = false;

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const props = this.props;

            return (
                <div className={"sdl-dita-delivery-toc"}>
                    { props.rootItems ?
                        <TreeView
                            rootNodes={this._convertToTreeViewNodes(props.rootItems) }
                            useCommonUILibraryScrollView={false}
                            onSelectionChanged={this._onSelectionChanged.bind(this) }/>
                        : <ActivityIndicator/>
                    }
                </div>
            );
        }

        /**
         * Component will unmount
         */
        public componentWillUnmount(): void {
            this._isUnmounted = true;
        }

        private _loadChildNodes(node: ITreeViewNode, callback: (childNodes: ITreeViewNode[]) => void): void {
            const props = this.props;
            props.loadChildItems(node.id, (error, children) => {
                if (error) {
                    // TODO error handling
                }
                callback(this._convertToTreeViewNodes(children, node));
            });
        }

        private _convertToTreeViewNodes(sitemapItems: ISitemapItem[], parentNode: ITreeViewNode = null): ITreeViewNode[] {
            const nodes: ITreeViewNode[] = [];
            const TreeViewControl = SDL.UI.Controls.TreeView;
            for (let sitemapItem of sitemapItems) {
                let newNode = TreeViewControl.prototype.createNode(sitemapItem.Id, sitemapItem.Title, "TOPIC",
                    parentNode, null, sitemapItem.IsLeaf, this._loadChildNodes.bind(this), true) as ITreeViewNode;
                newNode.sitemapItem = sitemapItem;
                nodes.push(newNode);
            }
            return nodes;
        }

        private _onSelectionChanged(nodes: ITreeViewNode[]): void {
            if (!this._isUnmounted) {
                const onSelectionChanged = this.props.onSelectionChanged;
                if (typeof onSelectionChanged === "function") {
                    onSelectionChanged(nodes.length > 0 ? nodes[0].sitemapItem : null);
                }
            }
        }

    }

}
