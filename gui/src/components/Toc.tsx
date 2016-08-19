/// <reference path="../interfaces/ServerModels.d.ts" />

module Sdl.KcWebApp.Components {

    import TreeView = SDL.ReactComponents.TreeView;
    import TreeViewControl = SDL.UI.Controls.TreeView;
    import ITreeViewNode = SDL.UI.Controls.ITreeViewNode;
    import ISitemapItem = Server.Models.ISitemapItem;

    export interface ITocProps {
        rootItems: Server.Models.ISitemapItem[];
        loadChildItems: (parentId: string, callback: (error: string, children: ISitemapItem[]) => void) => void;
    }

    /**
     * Table of contents
     */
    export class Toc extends React.Component<ITocProps, {}> {

        public render(): JSX.Element {
            const props = this.props;

            return (
                <div className={"sdl-kc-toc"}>
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
            for (let node of sitemapItems) {
                nodes.push(
                    TreeViewControl.prototype.createNode(node.Id, node.Title, "FOLDER",
                        parentNode, null, node.IsLeaf, this._loadChildNodes.bind(this), true));
            }
            return nodes;
        }

    }

}
