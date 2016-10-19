/// <reference path="../presentation/Toc.tsx" />
/// <reference path="../presentation/Page.tsx" />
/// <reference path="../presentation/Breadcrumbs.tsx" />
/// <reference path="../../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Models.IPageInfo;

    /**
     * PublicationContent component props
     *
     * @export
     * @interface IPublicationContentProps
     */
    export interface IPublicationContentProps {
        /**
         * Id of the current publication
         *
         * @type {string}
         */
        publicationId: string;
    }

    /**
     * PublicationContent component state
     *
     * @export
     * @interface IPublicationContentState
     */
    export interface IPublicationContentState {
        /**
         * Toc is loading
         *
         * @type {boolean}
         */
        isTocLoading?: boolean;
        /**
         * Current selected item in the TOC
         *
         * @type {ISitemapItem | null}
         */
        selectedTocItem?: ISitemapItem | null;
        /**
         * Page is loading
         *
         * @type {boolean}
         */
        isPageLoading?: boolean;
        /**
         * Current active item path in the TOC
         *
         * @type {string[]}
         */
        activeTocItemPath?: string[];
        /**
         * Title of the current publication
         *
         * @type {string}
         */
        publicationTitle?: string;
    }

    interface IPage {
        /**
         * Content of the current selected page
         *
         * @type {string | null}
         */
        content?: string | null;
        /**
         * An error prevented the page from rendering
         *
         * @type {string | null}
         */
        error?: string | null;
    }

    interface IToc {
        /**
         * An error prevented the toc from rendering
         *
         * @type {string}
         */
        error?: string;
        /**
         * Root items
         *
         * @type {ISitemapItem[]}
         */
        rootItems?: ISitemapItem[];
    }

    /**
     * Publication + content component
     */
    export class PublicationContent extends React.Component<IPublicationContentProps, IPublicationContentState> {

        private _page: IPage = {};
        private _toc: IToc = {};
        private _isUnmounted: boolean = false;

        /**
         * Creates an instance of App.
         *
         */
        constructor() {
            super();
            this.state = {
                isTocLoading: true,
                selectedTocItem: null,
                isPageLoading: true
            };
        }

        /**
         * Invoked once, both on the client and server, immediately before the initial rendering occurs.
         */
        public componentWillMount(): void {
            const { publicationId } = this.props;
            const getRootItems = (path?: string[]): void => {
                // Get the data for the Toc
                DataStore.getSitemapRoot(publicationId).then(
                    items => {
                        if (!this._isUnmounted) {
                            this._toc.rootItems = items;
                            this.setState({
                                activeTocItemPath: path,
                                isTocLoading: false,
                                isPageLoading: Array.isArray(items) && items.length > 0
                            });
                        }
                    },
                    error => {
                        if (!this._isUnmounted) {
                            this._toc.error = error;
                            this.setState({
                                isTocLoading: false,
                                isPageLoading: false
                            });
                        }
                    });
            };

            const location = Routing.getPublicationLocation();
            if (location && location.pageId) {
                // Set the current active path for the tree
                this._getActiveSitemapPath(location.pageId, getRootItems);
            } else {
                getRootItems();
            }
        }

        /**
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         *
         * @param {ITocProps} nextProps
         */
        public componentWillReceiveProps(nextProps: ITocProps): void {
            const location = Routing.getPublicationLocation();
            const { selectedTocItem } = this.state;
            if (location && location.pageId && (!selectedTocItem || location.pageId !== selectedTocItem.Url)) {
                // Set the current active path for the tree
                this._getActiveSitemapPath(location.pageId, (path) => {
                    this.setState({
                        activeTocItemPath: path
                    });
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
        public componentWillUpdate(nextProps: IPublicationContentProps, nextState: IPublicationContentState): void {
            const { publicationId } = this.props;
            const { selectedTocItem, isPageLoading } = this.state;
            const currentUrl = selectedTocItem ? selectedTocItem.Url : null;
            const nextUrl = nextState.selectedTocItem ? nextState.selectedTocItem.Url : null;
            if (nextState.selectedTocItem && !nextState.selectedTocItem.Url) {
                this._page.content = `<h1 class="title topictitle1">${nextState.selectedTocItem.Title}</h1>`;
            }
            if (nextUrl && (isPageLoading || currentUrl !== nextUrl)) {
                DataStore.getPageInfo(publicationId, nextUrl).then(
                    this._onPageContentRetrieved.bind(this),
                    this._onPageContentRetrievFailed.bind(this));
            }
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const { isPageLoading, activeTocItemPath, selectedTocItem, publicationTitle } = this.state;
            const { publicationId } = this.props;
            const { content, error} = this._page;
            const { rootItems } = this._toc;
            const tocError = this._toc.error;

            return (
                <section className={"sdl-dita-delivery-publication-content"}>
                    <Toc
                        activeItemPath={activeTocItemPath}
                        rootItems={rootItems}
                        loadChildItems={(parentId: string): Promise<ISitemapItem[]> => {
                            return DataStore.getSitemapItems(publicationId, parentId);
                        } }
                        onSelectionChanged={this._onTocSelectionChanged.bind(this)}
                        error={tocError} />
                    <Breadcrumbs
                        publicationId={publicationId}
                        publicationTitle={publicationTitle || ""}
                        loadItemsPath={DataStore.getSitemapPath.bind(DataStore)}
                        selectedItem={selectedTocItem} />
                    <Page
                        showActivityIndicator={isPageLoading || false}
                        content={content}
                        error={error}
                        onNavigate={Routing.setPageLocation.bind(Routing)} />
                </section>
            );
        }

        /**
         * Component will unmount
         */
        public componentWillUnmount(): void {
            this._isUnmounted = true;
        }

        private _onTocSelectionChanged(sitemapItem: ISitemapItem, path: string[]): void {
            const page = this._page;
            const { publicationId } = this.props;

            page.error = null;

            DataStore.getPublicationTitle(publicationId).then(
                title => {
                    this.setState({
                        activeTocItemPath: path,
                        publicationTitle: title,
                        selectedTocItem: sitemapItem,
                        isPageLoading: sitemapItem.Url ? true : false
                    });

                    Routing.setPublicationLocation(publicationId, title || "", sitemapItem.Url, sitemapItem.Title);
                },
                error => {
                    page.error = error;

                    this.setState({
                        activeTocItemPath: path,
                        selectedTocItem: sitemapItem,
                        isPageLoading: sitemapItem.Url ? true : false
                    });
                });
        }

        private _onPageContentRetrieved(pageInfo: IPageInfo): void {
            const page = this._page;
            page.content = pageInfo.content;
            this.setState({
                isPageLoading: false
            });
        }

        private _onPageContentRetrievFailed(error: string): void {
            const page = this._page;
            page.error = error;
            page.content = null;
            this.setState({
                isPageLoading: false
            });
        }

        private _getActiveSitemapPath(pageId: string, done: (path: string[]) => void): void {
            const { publicationId } = this.props;
            DataStore.getSitemapPath(publicationId, pageId).then(
                path => {
                    if (!this._isUnmounted) {
                        done(path.map(item => item.Id || "") || []);
                    }
                },
                error => {
                    if (!this._isUnmounted) {
                        this._toc.error = error;
                        this.setState({
                            isTocLoading: false,
                            isPageLoading: false
                        });
                    }
                });
        }
    };
}
