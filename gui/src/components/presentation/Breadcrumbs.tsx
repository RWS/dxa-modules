/// <reference path="../../interfaces/ServerModels.d.ts" />
/// <reference path="../../interfaces/Routing.d.ts" />

module Sdl.DitaDelivery.Components {

    import ISitemapItem = Server.Models.ISitemapItem;

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
         * @type {ISitemapItem}
         */
        selectedItem?: ISitemapItem | null;

        /**
         * Load items path for a specific item
         */
        loadItemsPath: (publicationId: string, parentId: string) => Promise<ISitemapItem[]>;
    }

    /**
     * Breadcrumbs props
     *
     * @export
     * @interface IBreadcrumbsProps
     */
    export interface IBreadcrumbsState {
        /**
         * Current selected item path
         *
         * @type {ISitemapItem}
         */
        itemPath?: ISitemapItem[];
    }

    /**
     * Breadcrumbs
     */
    export class Breadcrumbs extends React.Component<IBreadcrumbsProps, IBreadcrumbsState> {

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
            if (selectedItem && selectedItem.Url) {
                loadItemsPath(publicationId, selectedItem.Url).then(
                    path => {
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
         * @param {IPublicationContentProps} nextProps Next props
         * @param {IPublicationContentState} nextState Next state
         */
        public componentWillUpdate(nextProps: IBreadcrumbsProps, nextState: IBreadcrumbsProps): void {
            const { publicationId, selectedItem, loadItemsPath } = this.props;
            const currentUrl = selectedItem ? selectedItem.Url : null;
            const nextItem = nextProps.selectedItem;
            if (nextItem) {
                const nextUrl = nextItem.Url;
                if (nextUrl && (currentUrl !== nextUrl)) {
                    loadItemsPath(nextProps.publicationId || publicationId, nextUrl).then(
                        path => {
                            if (!this._isUnmounted) {
                                this.setState({
                                    itemPath: path
                                });
                            }
                        });
                }
                else if ((selectedItem && selectedItem.Id) != nextItem.Id) {
                    if (!this._isUnmounted) {
                        this.setState({
                            itemPath: nextItem ? [nextItem] : []
                        });
                    }
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

            const { selectedItem } = this.props;
            const currentUrl = selectedItem ? selectedItem.Url : null;

            return (
                <div className={"sdl-dita-delivery-breadcrumbs"}>
                    <ul>
                        <li>
                            <a onClick={(e: React.MouseEvent): void => {
                                Routing.setPublicationLocation(publicationId, publicationTitle);
                                e.preventDefault();
                            } } href={publicationId} title={publicationTitle}>{publicationTitle}</a>
                        </li>
                        {
                            Array.isArray(itemPath) && (
                                itemPath.map((item: ISitemapItem, key: number) => {
                                    return (
                                        <li key={key}>
                                            {
                                                (currentUrl != item.Url)
                                                    ? <a onClick={(e: React.MouseEvent): void => {
                                                        if (item.Url) {
                                                            Routing.setPageLocation(item.Url || "");
                                                        }
                                                        else {
                                                            Routing.setPublicationLocation(publicationId, publicationTitle, item.Url, item.Title);
                                                        }
                                                        e.preventDefault();
                                                    } } href={item.Url || item.Id} title={item.Title}>{item.Title}</a>
                                                    : <span>{item.Title}</span>
                                            }
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
}
