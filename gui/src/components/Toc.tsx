/// <reference path="../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import TreeView = SDL.ReactComponents.TreeView;
    import ITreeViewNode = SDL.UI.Controls.ITreeViewNode;
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
    }

    /**
     * Table of contents
     */
    export class Toc extends React.Component<ITocProps, {}> {

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const props = this.props;

            return (
                <div className={"sdl-dita-delivery-toc"}>
                    <TreeView
                        rootNodes={this._convertToTreeViewNodes(props.rootItems) }
                        useCommonUILibraryScrollView={false}/>
                </div>
            );
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
            for (let node of sitemapItems) {
                nodes.push(
                    TreeViewControl.prototype.createNode(node.Id, node.Title, "TOPIC",
                        parentNode, null, node.IsLeaf, this._loadChildNodes.bind(this), true));
            }
            return nodes;
        }

    }

}
