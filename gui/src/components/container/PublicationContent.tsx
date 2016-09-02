/// <reference path="../presentation/Toc.tsx" />
/// <reference path="../presentation/Page.tsx" />
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
         * @type {ISitemapItem}
         */
        selectedTocItem?: ISitemapItem;
        /**
         * Page is loading
         *
         * @type {boolean}
         */
        isPageLoading?: boolean;
    }

    interface IPage {
        /**
         * Content of the current selected page
         *
         * @type {string}
         */
        content?: string;
        /**
         * An error prevented the page from rendering
         *
         * @type {string}
         */
        error?: string;
        /**
         * Page title
         *
         * @type {string}
         */
        title?: string;
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
     * Main component for the application
     */
    export class PublicationContent extends React.Component<IPublicationContentProps, IPublicationContentState> {

        private _page: IPage = {};
        private _toc: IToc = {};
        private _isUnmounted: boolean = false;
        private _activePagePath: string[];

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
            const getRootItems = (): void => {
                // Get the data for the Toc
                DataStore.getSitemapRoot((error, items) => {
                    if (this._isUnmounted) {
                        return;
                    }

                    const toc = this._toc;

                    if (error) {
                        toc.error = error;
                        this.setState({
                            isTocLoading: false,
                            isPageLoading: false
                        });
                        return;
                    }

                    toc.rootItems = items;
                    this.setState({
                        isTocLoading: false,
                        isPageLoading: Array.isArray(items) && items.length > 0
                    });
                });
            };

            const location = Routing.getPublicationLocation();
            if (location) {
                // Set the current active path for the tree
                this._setActiveSitemapPath(location.sitemapItemId, getRootItems);
            } else {
               getRootItems();
            }
        }

        /**
         * Invoked immediately before rendering when new props or state are being received.
         * This method is not called for the initial render.
         *
         * @param {{}} nextProps Next props
         * @param {IPublicationContentState} nextState Next state
         */
        public componentWillUpdate(nextProps: IPublicationContentProps, nextState: IPublicationContentState): void {
            const { selectedTocItem, isPageLoading } = this.state;
            const currentUrl = selectedTocItem ? selectedTocItem.Url : null;
            const nextUrl = nextState.selectedTocItem ? nextState.selectedTocItem.Url : null;
            if (nextUrl && (isPageLoading || currentUrl !== nextUrl)) {
                DataStore.getPageInfo(nextUrl, this._onPageContentRetrieved.bind(this));
            }
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const { isPageLoading, selectedTocItem } = this.state;
            const { content, title, error} = this._page;
            const { rootItems } = this._toc;
            const tocError = this._toc.error;

            return (
                <section className={"sdl-dita-delivery-publication-content"}>
                    <Toc
                        activeItemPath={this._activePagePath}
                        rootItems={rootItems}
                        loadChildItems={DataStore.getSitemapItems.bind(DataStore) }
                        onSelectionChanged={this._onTocSelectionChanged.bind(this) }
                        error={tocError}/>
                    <Page
                        showActivityIndicator={isPageLoading}
                        content={content}
                        title={title ? title : (selectedTocItem ? selectedTocItem.Title : null) }
                        error={error}/>
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
            if (!sitemapItem.Url) {
                page.title = null;
                page.content = null;
            }

            this._activePagePath = path;

            DataStore.getPublicationTitle(publicationId, (error, title) => {
                if (error) {
                    page.error = error;
                }
                this.setState({
                    selectedTocItem: sitemapItem,
                    isPageLoading: sitemapItem.Url ? true : false
                });

                if (!error) {
                    Routing.setPageUrl(publicationId, title, sitemapItem.Id, sitemapItem.Title);
                }
            });
        }

        private _onPageContentRetrieved(error: string, pageInfo: IPageInfo): void {
            const page = this._page;
            const { selectedTocItem } = this.state;
            if (error) {
                page.error = error;
                page.title = null;
                page.content = null;
                this.setState({
                    isPageLoading: false
                });
                return;
            }
            page.content = pageInfo.content;
            page.title = pageInfo.title ? pageInfo.title : selectedTocItem.Title;
            this.setState({
                isPageLoading: false
            });
        }

        private _setActiveSitemapPath(sitemapItemId: string, done: () => void): void {
            DataStore.getSitemapPath(sitemapItemId, (error, path) => {
                if (this._isUnmounted) {
                    return;
                }

                if (error) {
                    const toc = this._toc;
                    toc.error = error;
                    this.setState({
                        isTocLoading: false,
                        isPageLoading: false
                    });
                    return;
                }
                this._activePagePath = path;

                done();
            });
        }
    };
}
